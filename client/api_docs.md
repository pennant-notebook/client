# DynamoDB Tables

## Tables

**1. notebookusers**

| Field    | Type        |
| -------- | ----------- |
| username | string      |
| userID   | UUID string |

**2. notebooks**

| Field    | Type        |
| -------- | ----------- |
| username | string      |
| docID    | UUID string |

## API Endpoints

**1. fetchUserFromDynamo**

- Endpoint: `GET /api/user/:username`
- Description: Fetches a user from the `notebookusers` table.

**2. createUserInDynamo**

- Endpoint: `POST /api/user/:username`
- Description: Creates a new user in the `notebookusers` table.

**3. fetchNotebooksFromDynamo**

- Endpoint: `GET /api/user/:username/notebooks`
- Description: Fetches all notebooks for a given user from the `notebooks` table.

**4. fetchDocFromDynamo**

- Endpoint: `GET /api/doc/:docID`
- Description: Fetches a notebook with a given `docID` from the `notebooks` table.

**5. createDocInDynamo**

- Endpoint: `POST /api/doc/:username`
- Description: Creates a new notebook for a given `username` in the `notebooks` table.

**6. editDocTitleInDynamo**

- Endpoint: `PUT /api/doc/:docID/:username`
- Description: Edits the title for a notebook for a given `docID` in the `notebooks` table.
- Note: Pass the `title` object in the request body.
