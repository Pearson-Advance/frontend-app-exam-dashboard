import React from 'react';
import { getConfig } from '@edx/frontend-platform';

import { Footer as FooterBase, ItemLink } from 'react-paragon-topaz';

const Footer = () => {
  const privacyPolicyLink = () => `${getConfig().FOOTER_PRIVACY_POLICY_LINK}`;
  const termsOfServiceLink = () => `${getConfig().FOOTER_TERMS_OF_SERVICE_LINK}`;
  const currentYear = new Date().getFullYear();
  const copyRightText = `Copyright ${currentYear} Pearson Education Inc. or its affiliate(s). All rights reserved.`;

  return (
    <FooterBase
      copyright={copyRightText}
      variant="blue"
    >
      <ItemLink
        label="Privacy policy"
        href={privacyPolicyLink()}
        target="_blank"
        rel="noopener noreferrer"
      />
      <ItemLink
        label="Terms of service"
        href={termsOfServiceLink()}
        target="_blank"
        rel="noopener noreferrer"
      />
    </FooterBase>
  );
};

export default Footer;
