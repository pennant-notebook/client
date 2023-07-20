import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import dynamodb from '../config/dynamodb.js';
const router = express.Router();

// ************ GET: FETCH USER, FETCH USER NOTEBOOKS **********
router.get('/user/:username', async (req, res) => {
  const userParams = {
    TableName: 'notebookusers',
    Key: {
      username: req.params.username
    }
  };

  try {
    const userData = await dynamodb.get(userParams);
    if (!userData.Item) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(userData.Item);
    }
  } catch (error) {
    console.error(`Error fetching user ${req.params.username}:`, error);
    res.status(500).json({ error: 'Could not fetch user' });
  }
});

router.get('/notebooks/:username', async (req, res) => {
  const notebooksParams = {
    TableName: 'notebooks',
    FilterExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': req.params.username
    }
  };

  try {
    const notebooksData = await dynamodb.scan(notebooksParams);
    res.json(notebooksData.Items || []);
  } catch (error) {
    console.error(`Error fetching notebooks for user ${req.params.username}:`, error);
    res.status(500).json({ error: 'Could not fetch notebooks' });
  }
});

// FETCH SINGLE NOTEBOOK
router.get('/doc/:username/:docID', async (req, res) => {
  const params = {
    TableName: 'notebooks',
    Key: {
      docID: req.params.docID,
      username: req.params.username
    }
  };

  try {
    const data = await dynamodb.get(params);
    if (!data.Item) {
      res.status(404).json({ error: 'Notebook not found' });
    } else {
      res.json(data.Item);
    }
  } catch (error) {
    console.error(`Error fetching notebook ${req.params.docID}:`, error);
    res.status(500).json({ error: 'Could not fetch notebook' });
  }
});

// ************ POST/PUT: CREATE USER, CREATE/EDIT NOTEBOOK **********

// CREATE NEW NOTEBOOK FOR USER
router.post('/doc/:username', async (req, res) => {
  const newDocId = uuidv4();

  // Fetch the userID of the given username
  const userParams = {
    TableName: 'notebookusers',
    Key: {
      username: req.params.username
    }
  };

  let userID;
  try {
    const user = await dynamodb.get(userParams);
    if (!user.Item) {
      return res.status(404).json({ error: 'User not found' });
    }
    userID = user.Item.userID;
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Could not fetch user' });
  }

  const params = {
    TableName: 'notebooks',
    Item: {
      docID: newDocId,
      username: req.params.username,
      userID: userID
    }
  };

  try {
    await dynamodb.put(params);
    res.json(params.Item);
  } catch (error) {
    console.error('Error creating notebook:', error);
    res.status(500).json({ error: 'Could not create notebook' });
  }
});

// CREATE NEW USER
router.post('/user/:username', async (req, res) => {
  const id = uuidv4();

  const params = {
    TableName: 'notebookusers',
    Item: {
      userID: id,
      username: req.params.username
    }
  };
  try {
    await dynamodb.put(params);
    res.json(params.Item);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Could not create user' });
  }
});

// EDIT USER DOCUMENT
router.put('/:username/:docID', async (req, res) => {
  const params = {
    TableName: 'notebooks',
    Key: {
      docID: req.params.docID,
      username: req.params.username
    },
    UpdateExpression: 'set title = :title',
    ExpressionAttributeValues: {
      ':title': req.body.title
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const data = await dynamodb.update(params);
    res.json(data.Attributes);
  } catch (error) {
    console.error(`Error updating notebook ${req.params.docID}:`, error);
    res.status(500).json({ error: 'Could not update notebook' });
  }
});

export default router;
