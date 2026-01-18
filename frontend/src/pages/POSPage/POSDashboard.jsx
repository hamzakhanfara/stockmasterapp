import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



const POSDashboard = observer(() => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div>
        <Typography variant="h5">{t('posDashboard.title')}</Typography>
        <Accordion sx={{color: 'inherit'}} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography variant="h6">{t('posDashboard.ordersInHold')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {/* Contenu des commandes en attente */}
            </AccordionDetails>
        </Accordion>
    </div>
  )
});

export default POSDashboard