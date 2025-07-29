import asyncHandler from 'express-async-handler';
import Session from '../models/Session.js';

const buildSessionQuery = (req, isMySessions = false) => {
  let query = {};
  if (isMySessions && req.query.status) {
    query.status = req.query.status;
  } else if (!isMySessions) {
    query.status = 'published'; 
  }

  if (req.query.keyword) {
    const keyword = req.query.keyword;
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { json_file_url: { $regex: keyword, $options: 'i' } }, 
    ];
  }

  if (req.query.startDate || req.query.endDate) {
    query.created_at = {};
    if (req.query.startDate) {
      query.created_at.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      query.created_at.$lte = endDate;
    }
  }

  if (isMySessions && req.user && req.user._id) {
    query.user_id = req.user._id;
  }

  return query;
};

const getPublicSessions = asyncHandler(async (req, res) => {
  const query = buildSessionQuery(req, false); 
  const sessions = await Session.find(query).select('-__v');
  res.json(sessions);
});

const getMySessions = asyncHandler(async (req, res) => {
  const query = buildSessionQuery(req, true); 
  const sessions = await Session.find(query).select('-__v');
  res.json(sessions);
});

const getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  }).select('-__v');

  if (session) {
    res.json(session);
  } else {
    res.status(404);
    throw new Error('Session not found or not owned by user');
  }
});

const saveDraftSession = asyncHandler(async (req, res) => {
  const { _id, title, tags, json_file_url } = req.body;

  let session;
  if (_id) {
    session = await Session.findOne({ _id, user_id: req.user._id });

    if (session) {
      session.title = title || session.title;
      session.tags = tags || session.tags;
      session.json_file_url = json_file_url || session.json_file_url;
      session.status = 'draft';
      const updatedSession = await session.save();
      res.json(updatedSession);
    } else {
      res.status(404);
      throw new Error('Session not found or not owned by user');
    }
  } else {
    session = await Session.create({
      user_id: req.user._id,
      title,
      tags,
      json_file_url,
      status: 'draft',
    });
    res.status(201).json(session); // 201 Created
  }
});

const publishSession = asyncHandler(async (req, res) => {
  const { id } = req.body; 

  const session = await Session.findOne({
    _id: id,
    user_id: req.user._id, 
    status: 'draft',       
  });

  if (session) {
    session.status = 'published';
    const publishedSession = await session.save();
    res.json(publishedSession);
  } else {
    res.status(404);
    throw new Error('Draft session not found or not owned by user');
  }
});

export {
  getPublicSessions,
  getMySessions,
  getSessionById,
  saveDraftSession,
  publishSession,
};