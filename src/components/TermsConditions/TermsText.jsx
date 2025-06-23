export const TermsText = () => {
  const cookiesLink = 'https://www.pearsonvue.com/privacy';
  const termsLink = 'https://wsr.pearsonvue.com/terms';

  return (
    <>
      <h3>Pearson VUE privacy policy</h3>
      <p> By accessing this website and checking the box below you understand and agree to the terms set forth
        in this Candidate Agreement (“Agreement”). This Agreement is entered into by and between you as a test
        taker, Pearson VUE, a business of NCS Pearson, Inc., and your testing program owner (“Test Sponsor”).
        This Agreement represents your understanding and acceptance of Pearson VUE&apos;s <a href={cookiesLink} target="_blank" rel="noopener noreferrer">Privacy and Cookies Policy</a>,
        including the collection of your data and the monitoring of your entire
        testing session through the use CCTV and Pearson VUE&apos;s <a href={termsLink} target="_blank" rel="noopener noreferrer">Terms of Service Policy</a>,
        in conjunction with your acceptance of the policies and procedures as established by the Test Sponsor
        and our obligations to process your test results.
      </p>
      <h3>Data Collection</h3>
      <p>You agree that for purposes of registering and scheduling your exam on Pearson VUE&apos;s website or during
        your testing process you may be asked to provide your personal information relating to your contact details
        (name, street address, email address, phone number). In some cases, we may request and process so-called
        &apos;special categories of personal information&apos; or &apos;sensitive data&apos; about you as set
        forth in our <a href={cookiesLink} target="_blank" rel="noopener noreferrer">Privacy and Cookies Policy</a>.
      </p>
      <h3>Data Processing</h3>
      <p>You understand and agree that Pearson VUE, as a data processor for your Test Sponsor, the data controller,
        will collect, use, transfer, process, and store your personal information only for the purposes of handling
        your registration, scheduling you for a test date and time, administering the test, processing
        your test results, and other related services, if any, consistent with Pearson VUE&apos;s Privacy
        and Cookies Policy, or, in addition as you have authorized. For more detailed information about
        Pearson VUE&apos;s data collection, processing, transfer, and storage practices, and your rights
        as a data subject, please go to Pearson VUE&apos;s <a href={cookiesLink} target="_blank" rel="noopener noreferrer">Privacy and Cookies Policy</a>
      </p>
      <p>Your personal information along with your test results will be provided to your Test Sponsor for
        the purposes of your Test Sponsor providing certification, licensure, academic admission test scores,
        and other benefits to you. For more detailed information about your Test Sponsor&apos;s policies,
        please contact your Test Sponsor.
      </p>
      <h3>Data Transfer</h3>
      <p>You agree to the transfer of your personal information by Pearson VUE to its headquarters in
        the United States, its authorized third parties (described below) and your Test Sponsor who
        may be located elsewhere in the world. You agree that Pearson VUE may employ other companies or
        individuals to perform services on our behalf and under Pearson VUE&apos;s written instructions,
        including but not limited to web hosting, payment processing, order processing and fulfillment,
        marketing and promotions, web analytics, and test delivery at our authorized-third party test centers.
        Pearson VUE will not transfer your personal information to any third parties who are not acting as
        Pearson VUE&apos;s agents, sub-processors, Test Sponsors, or individuals&apos; providing other
        services on Pearson VUE&apos;s behalf, except as, in addition, you have authorized.
      </p>
      <h3>CCTV</h3>
      <p>You agree that during your entire testing session you may be monitored by CCTV for purposes of
        validating your compliance with the testing room rules.
      </p>
      <h3>Palm Vein Consent</h3>
      <p> Where selected by your Test Sponsor, you agree that Pearson VUE will collect your palm vein
        pattern at the test center on the day of your exam and retain that information, to the extent
        permitted by law. Your palm vein scan will be used for the purposes of identification verification
        on the day of your test and on your future test days, detecting and preventing any fraud,
        and maintaining the security and integrity of the testing program. For more information
        on Pearson VUE&apos;s policy for use and retention of personal data including biometric data like
        palm vein scans, please see our Privacy and Cookies Policy. Your agreement to these
        Testing policies includes agreement to the <a href={cookiesLink} target="_blank" rel="noopener noreferrer">Privacy and Cookies Policy</a>.
      </p>
      <p>By clicking the “Agree” button, you acknowledge that you understand, agree, and explicitly
        consent to the terms contained in this Agreement. If you do not agree to the policies and
        terms contained in this Agreement and you click “Previous” you will not be able to continue
        through this website registration and scheduling process and you will need to contact
        Pearson VUE for assistance.
      </p>
    </>
  );
};
