import logo from './assets/logo.png';
import { Box, IconButton, Typography, Stack } from '@mui/material';
import { PlayCircleOutlineTwoTone } from '@mui/icons-material';
import { checkDreddStatus, sendManyToDredd } from './services/dreddExecutionService';
import useNotebookContext from './NotebookContext'

// ! sample
/* 
[{
        	"cellId": "3",
        	"code": "const name = 'Bob'"
    	},
    	{
        	"cellId": "4",
        	"code": "const age = 30"
    	},
    	{
        	"cellId": "5",
        	"code": "console.log(name, ' is ', age, ' years old')"
    	}
    ]
*/


/* 
{
    "submissionId": "5ab590ec-e177-41d2-aae4-8556989cb911",
    "status": "success",
    "requestOrder": [
        [
            "3",
            "4",
            "5"
        ]
    ],
    "cellsExecuted": [
        "3",
        "4",
        "5"
    ],
    "results": [
        {
            "cellId": "3",
            "type": "output",
            "output": ""
        },
        {
            "cellId": "4",
            "type": "output",
            "output": ""
        },
        {
            "cellId": "5",
            "type": "output",
            "output": "Bob  is  30  years old\n"
        }
    ]
}
*/

const Header = ({roomID, codeCells}) => {
    const {doc} = useNotebookContext()

    const handleRunAllCode = async () => {
        const token = await sendManyToDredd(roomID, codeCells)
        const response = await checkDreddStatus(token);

        response.forEach(codeCell => {
            const cell = doc.getArray('cells').toArray().find(c => c.get('id') === codeCell["cellId"] )
            if (cell && codeCell.output) {
                const outputMap = cell.get('outputMap')
                outputMap.set('data', codeCell.output);
            }
        })
    }

  return (
    <Stack direction='row' sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'left', flex: '1' }}>
        <img src={logo} width='48px' />
        <Typography variant='overline' sx={{ fontSize: '1.5rem', ml: '0.5rem' }}>
          Pennant
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
        <IconButton
          onClick={handleRunAllCode}
          sx={{ color: 'steelblue', '&:hover': { color: 'dodgerblue' } }}
          >
          <PlayCircleOutlineTwoTone sx={{ fontSize: '48px' }} />
        </IconButton>
      </Box>
    </Stack>
  );
};
export default Header;
