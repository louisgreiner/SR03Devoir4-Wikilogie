import React from 'react';
import EmailIcon from '@material-ui/icons/Email';
import { Link } from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
const Footer = () => (
  <div className='footer'>
    <p>
      <EmailIcon     
        style={{ cursor: 'pointer' }}                    
        onClick={() => 
          window.open('mailto:wikilogie@assos.utc.fr?subject=Contact client Wikilogie : ')
        }
      /> wikilogie@assos.utc.fr
    </p>
    <p style={{marginLeft: '10%'}}>
      <LanguageIcon/>
        <Link href='https://assos.utc.fr/wikilogie/'>
          https://assos.utc.fr/wikilogie/
        </Link>
    </p>
  </div>
);

export default Footer;
