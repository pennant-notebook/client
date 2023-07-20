// import express from 'express';
// import { v4 as uuidv4 } from 'uuid';
// import dynamoDb from '../config/dynamo.js';
// const router = express.Router();

// // Fetch USER to display user's notebooks
// router.get('/:username', async (req, res) => {
//   const params = {
//     TableName: 'notebooks',
//     FilterExpression: 'username = :username',
//     ExpressionAttributeValues: {
//       ':username': req.params.username
//     }
//   };

//   try {
//     const data = await dynamoDb.scan(params);
//     res.json(data.Items);
//   } catch (error) {
//     console.error(`Error fetching notebooks for username ${req.params.username}:`, error);
//     res.status(500).json({ error: 'Could not fetch notebooks' });
//   }
// });

// // FETCH USER NOTEBOOK
// router.get('/:username/:slug', async (req, res) => {
//   let params = {
//     TableName: 'notebooks',
//     Key: {
//       docID: req.params.slug,
//       username: req.params.username
//     }
//   };

//   try {
//     let data = await dynamoDb.get(params);
//     if (!data.Item) {
//       // Document not found by docID, try to find by slug
//       params = {
//         TableName: 'notebooks',
//         IndexName: 'username-slug-index', // You need to create this GSI in your DynamoDB table
//         KeyConditionExpression: 'username = :username and slug = :slug',
//         ExpressionAttributeValues: {
//           ':username': req.params.username,
//           ':slug': req.params.slug
//         }
//       };
//       data = await dynamoDb.query(params);
//       if (!data.Items || !data.Items.length) {
//         res.status(404).json({ error: 'Notebook not found' });
//         return;
//       }
//       res.json(data.Items[0]);
//     } else {
//       res.json(data.Item);
//     }
//   } catch (error) {
//     console.error(`Error fetching notebook ${req.params.slug}:`, error);
//     res.status(500).json({ error: 'Could not fetch notebook' });
//   }
// });

// // CREATE NEW NOTEBOOK FOR USER
// router.post('/doc/:username', async (req, res) => {
//   const newDocId = uuidv4();

//   // Fetch the userID of the given username
//   const userParams = {
//     TableName: 'notebookusers',
//     Key: {
//       username: req.params.username
//     }
//   };

//   let userID;
//   try {
//     const user = await dynamoDb.get(userParams);
//     if (!user.Item) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     userID = user.Item.userID;
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     return res.status(500).json({ error: 'Could not fetch user' });
//   }

//   const params = {
//     TableName: 'notebooks',
//     Item: {
//       docID: newDocId,
//       slug: newDocId,
//       title: newDocId,
//       username: req.params.username,
//       userID: userID
//     }
//   };

//   try {
//     await dynamoDb.put(params);
//     res.json(params.Item);
//   } catch (error) {
//     console.error('Error creating notebook:', error);
//     res.status(500).json({ error: 'Could not create notebook' });
//   }
// });

// // CREATE NEW USER
// router.post('/user/:username', async (req, res) => {
//   const id = uuidv4();

//   const params = {
//     TableName: 'notebookusers',
//     Item: {
//       userID: id,
//       username: req.params.username
//     }
//   };
//   try {
//     await dynamoDb.put(params);
//     res.json(params.Item);
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ error: 'Could not create user' });
//   }
// });

// // EDIT USER DOCUMENT
// router.put('/:username/:docID', async (req, res) => {
//   const params = {
//     TableName: 'notebooks',
//     Key: {
//       docID: req.params.docID,
//       username: req.params.username
//     },
//     UpdateExpression: 'set title = :title, slug = :slug',
//     ExpressionAttributeValues: {
//       ':title': req.body.title,
//       ':slug': req.body.slug
//     },
//     ReturnValues: 'UPDATED_NEW'
//   };

//   try {
//     const data = await dynamoDb.update(params);
//     res.json(data.Attributes);
//   } catch (error) {
//     console.error(`Error updating notebook ${req.params.docID}:`, error);
//     res.status(500).json({ error: 'Could not update notebook' });
//   }
// });

// export default router;
