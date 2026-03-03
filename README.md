# Open edX Frontend App Exam Dashboard

This MFE adds WebNG service integrations to the Open edX platform.

WebNG is a web interface through which candidates can schedule, reschedule,
and pay for Pearson VUE exams and launch exams delivered through OnVUE.

This MFE allows users to schedule, reschedule, cancel their exams on the WebNG website, this MFE also allows displaying information about the user exam such has the date, location and grade of their exams. This MFE is placed on a top-level tab named "Exams", which is a peer to "Courses".

## Getting Started

### Development Setup

1. Clone this repository:

    ```bash
    git clone https://github.com/Pearson-Advance/frontend-app-exam-dashboard.git ~/openedx/src/frontend-app-exam-dashboard
    # Follow that repository's README for install and start instructions
    ```

3. Install nvm (Node Version Manager).

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```

3. Download and install Node.js (you may need to restart the terminal).

    ```bash
    nvm install 16
    # Verifies the right Node.js version is in the environment.
    node -v # Should print 'v16.20.2'
    # Verifies the right NPM version is in the environment.
    npm -v # Should print '8.19.4'
    ```

4. Install NPM dependencies:

    ```bash
    cd ~/openedx/src/frontend-app-exam-dashboard
    npm install
    ```

5. Run tests:

    ```bash
    npm test  # Run Jest tests.
    npm run lint  # Run lint tests.
    ```

6. Start the project:

    ```bash
    npm start
    ```

**NOTE:** Please make sure that the Node version is equal to `v16.20.2`. Execute `nvm ls` to list all the installed versions, if there's any other prior or further version installed, please remove it with `nvm uninstall vXX.XX.X`
