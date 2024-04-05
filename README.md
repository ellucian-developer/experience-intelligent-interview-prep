# Intelligent Interview Prep

This project details a way to use several Ellucian products in concert with OpenAI to provide a tool for students to prepare for job interviews.

# 1. Get the project repo
1. clone or download the repo from https://github.com/ellucian-developer/experience-intelligent-interview-prep

# 2. Setup Banner Custom Table iip-results

## 2.1. Give Integration API user permission to add custom table
1. Determine the Banner Integration Ethos user
1. Open Banner Access Management (BAM)
1. Open Oracle/Banner Security Maintenance (GSASECR)
1. Enter the Banner Integration user in the Principal User ID
1. Click on Permissions -> Modify
1. Cick Insert and enter API_CUSTOM_TABLE_CONFIG for the Object Name and BAN_DEFAULT_M for the Role Name
1. Click SAVE

## 2.2. Create custom table
Bruno or Postman to POST the new table
1. Create a Post request to https://integrate.elluciancloud.com/api/custom-table-configurations
1. Use file banner-extensibility/x-iip-result.json as the body.
1. Set Accept header to application/json
1. Add a Bearer token using your preferred method from calling https://integrate.elluciancloud.com/auth to get a token.

Note: the table name has to start with an X and the second character has to be defined in GTVSYSI_CODE. I used an "S" which is for Student.

## 2.3. Give Integration API user permission to acces the custom table's API
1. Open Oracle/Banner Security Maintenance (GSASECR)
1. Enter the Banner Integration user in the Principal User ID
1. Click on Permissions -> Modify
1. Cick Insert and enter API_X_IIP_RESULTS for the Object Name and BAN_DEFAULT_M for the Role Name. Note: the Object name is in the json body sent when creating the custom table
1. Click SAVE

## 2.4. Add Resource to Integration API in Ethos
1. Open Ethos Integration administration UI
1. Find the Banner Integration application that is the source for the Integration API
1. Ether "Auto-configure" or manually add the x-iip-results resource. If you use auto configure, you can verify by searching for resource in the Owned Resources

## 2.5. Verify custom table API
You should now be able to issue a GET on the x-iip-results resource.

# 3. Create pipelines in Data Connect

1. Open Integration Designer and create a package. Names have to be global, so use something like your .edu name as a prefix. I named mine elive2024-iip.

## 3.2. Create a get-student-advisor pipeline.

This first pipeline is used by EIP to fetch the student's advisor. This is to make the assigment to the advisor when the student requests coaching.

1. From the package you created, click on the + Pipeline button
1. Chose Pipeline Type - API
1. Name it your prefix-get-student-advisor. Mine is named elive2024-get-student-advisor
1. HTTP Method - GET
1. Authentication Type - Ethos Token
1. Description - Get the student advisor for EIP Action
1. Save
1. Import - Click on the down arrow next to the GET in the header and pick "Import Pipeline"
1. Pick data-connect/get-student-advisor.json from the directory with this projects files.
1. Confirm there are 4 fittings in the Pipeline and two properties in the Output Schema
1. Save and then Publish. Version doesn't really matter but you might wish to start with version 1.0.0

## 3.3. Create a get-program pipeline.

This and subsequent pipelines are invoked from the Extension. Note these will all use the User Token for the Authentication Type.

1. From the package you created, click on the + Pipeline button
1. Chose Pipeline Type - API
1. Name it your prefix-get-program. Mine is named elive2024-get-program
1. HTTP Method - GET
1. Authentication Type - User Token
1. Description - GET the current user's matriculated student-academic-program
1. Save
1. Import - Click on the down arrow next to the GET in the header and pick "Import Pipeline"
1. Pick data-connect/get-program.json from the directory with this projects files.
1. Confirm there are 2 fittings in the Pipeline.
1. Save and then Publish. Version doesn't really matter but you might wish to start with version 1.0.0

## 3.4. Create a get-generate-company-info pipeline.
Note: this pipelilne will use the OpenAI Key set in Experience Card Configuration. It defaults to using a OpenAI model of "gpt-4-turbo-preview" at the time this was shared. However, the "best" model will change over time.

1. From the package you created, click on the + Pipeline button
1. Chose Pipeline Type - API
1. Name it your prefix-get-generate-company-info. Mine is named elive2024-get-generate-company-info
1. HTTP Method - GET
1. Authentication Type - User Token
1. Description - generates company information
1. Save
1. Import - Click on the down arrow next to the POST in the header and pick "Import Pipeline"
1. Pick data-connect/get-generate-company-info.json from the directory with this projects files.
1. Confirm there are 3 fittings in the Pipeline.
1. Save and then Publish. Version doesn't really matter but you might wish to start with version 1.0.0

## 3.5. Create a get-generate-interview-tips pipeline.
Note: this pipelilne will use the OpenAI Key set in Experience Card Configuration. It defaults to using a OpenAI model of "gpt-4-turbo-preview" at the time this was shared. However, the "best" model will change over time.

1. From the package you created, click on the + Pipeline button
1. Chose Pipeline Type - API
1. Name it your prefix-get-generate-interview-tips. Mine is named elive2024-get-generate-interview-tips
1. HTTP Method - GET
1. Authentication Type - User Token
1. Description - generates interview tips
1. Save
1. Import - Click on the down arrow next to the POST in the header and pick "Import Pipeline"
1. Pick data-connect/get-generate-interview-tips.json from the directory with this projects files.
1. Confirm there are 3 fittings in the Pipeline.
1. Save and then Publish. Version doesn't really matter but you might wish to start with version 1.0.0

## 3.6. Create a post-generate-interview-response pipeline.
Note: this pipelilne will use the OpenAI Key set in Experience Card Configuration. It defaults to using a OpenAI model of "gpt-4-turbo-preview" at the time this was shared. However, the "best" model will change over time.

1. From the package you created, click on the + Pipeline button
1. Chose Pipeline Type - API
1. Name it your prefix-post-generate-interview-response. Mine is named elive2024-post-generate-interview-response
1. HTTP Method - POST
1. Authentication Type - User Token
1. Description - POST chat messages to get a response from OpenAI
1. Save
1. Import - Click on the down arrow next to the POST in the header and pick "Import Pipeline"
1. Pick data-connect/post-generate-interview-response.json from the directory with this projects files.
1. Confirm there are 3 fittings in the Pipeline.
1. Save and then Publish. Version doesn't really matter but you might wish to start with version 1.0.0

## 3.7. Create a post-iip-results pipeline.
Note: this pipelilne posts a result from an interview to the custom table created in section 2 above.

1. From the package you created, click on the + Pipeline button
1. Chose Pipeline Type - API
1. Name it your prefix-post-iip-results. Mine is named elive2024-post-iip-results
1. HTTP Method - POST
1. Authentication Type - User Token
1. Description - POST Intelligent Interview Prep results to the custom table
1. Save
1. Import - Click on the down arrow next to the POST in the header and pick "Import Pipeline"
1. Pick data-connect/post-chat.json from the directory with this projects files.
1. Confirm there are 2 fittings in the Pipeline.
1. Save and then Publish. Version doesn't really matter but you might wish to start with version 1.0.0

## 3.8. Verify and Configure Ethos to allow execution of get-student-advisor pipeline
1. Login to Ethos Integration administration application.
1. Pick "Platform Components" from the top nav
1. Find and view "Data Connect"
1. Verify that "Owned Resources" shows your prefix-get-student-advior resource. While you are there verify the other 4 pipelines APIs are listed as well.
1. Pick the "Application Access" tab and press the "ADD APPLICATION ACCESS" button.
1. Select the application you wish to use when the API call is made from EIP. (same application coming up in step 9)
1. Press the "ADD" button.
1. Pick "Applications" from the top nav
1. Find an open the application you wish to use when the API call is made from EIP. This could be the same Ethos application used by Experience or another one you create for this specific pupose.
1. Open the tab named "Tags"
1. Click on "ADD TAG" and enter the name "integration-package" and the value of your package created in section 3.1 above. Note the name has to be modified to remove dashes and camel case words. Mine package is named elive2024-iip, so I enter "elive2024Iip". Note if this tag is already present, add your package to the list in the values, using a comma to seperate multiple packages. See docs for details on the package name changes - https://resources.elluciancloud.com/bundle/ethos_data_connect/page/t_dc_designer_ethos_token_configuration.html
1. Click Save

## 3.9. Configure Experience Permissions so that your target users can execute the User Token pipelines
Note: You should have already verified the three pipelilnes used by the extension are available on the Platform Component. See Section 4 above.
1. Login to Experience Setup
1. Pick "Permissions" from the top nav
1. Ensure the Environment is correct in the top right.
1. Find and click on "Data Connect"
1. Find APIs in the left navigation and expand it to show your package name. Click on your package.
1. For each of the pipeline/API names, click on it and then select the Roles and/or Users you need. Be sure to save after clicking the check box on each one. In my case I allow any "student" to execute these pipelines.

# 4. Setup Insights

1. Get access to the Insights Administration card. This entails configuring the card in Experience and granting permission to a user's role in Experience Setup -> Permissions -> Insights -> Insights Administration

## 4.2 Configure Custom Table's Dataset
1. Use Insights Administration card to launch "Configuration"
1. Pick "Custom Datasets" and press the "+" to add a dataset
1. Give it an appropriate name like "Intelligent Interview Prep"
1. Pick System Type of "Banner"
1. Click on Choose File and pick the csv file in this repo. insights/XSIPRES-dataset.csv.
1. Pick the Intended Replication of "Ongoing replication".
1. Click on Create & Load Now
1. After this finishes, you will now have a new Dataset

## 4.3 Ingest the Custom Table
1. Use Insights Administration card to launch "Ingestion"
1. Click on "Add Data".
1. Select the Data Source for your Banner DB and click on the "Next" button
1. Select your Dataset. Mine is "Intelligent Interview Prep".
1. Click on "Load now". You can watch it work on the "Recent Activity" tab. When done it should show a status of "Active"

## 4.3 Populate the Custom Table data
1. Use Insights Administration card to launch "Population"
1. Click on the "+" button to add the population.
1. Select your Banner Data Source.
1. Select a job type of "Custom Datasets". Note Custom Datasets only shows after you have created your custom dataset.
1. Select a Job template which will be "Custom <your dataset name>". Do NOT pick the one with the "Stage Validation" suffix.
1. Give it an appropriate Job name. I used "Load IIP"
1. Select "Load".
1. Select "Run now".
1. Click on "Create Job" button. You can monitor it in the "Activity" tab.
1. Note this should complete but no data exists yet, unless you manually used the custom table's API to POST data.
1. Create a refresh job. So that data is refreshed periodically from the lake.
1. While still in Insights Administration -> Population, select the "+" button.
1. As before, pick the same Data Source, Job Type, and Job Template as above. Steps 3-5.
1. Give it an appropriate job name. I used "Refresh IIP"
1. Select "Refresh"
1. Select "On a recurring schedule" or "Now (when created), then on a recurring schedule"
1. You can use either Daily or twice daily. and pick an appropriate time.
1. Click on "Create Job"

## 4.4 Create a visulization
1. Use the "Insights" card to "Launch Reports"
1. Pick "Browse data"
1. Pick "Data Warehouse"
1. Pick "ban_extensions"
1. Pick "Xsipres"
1. Click on the "Summarize" botton in the top right.
1. Ensure "Summarize by" is set to Count
1. Pick "Group By" on "Xsipres rating"
1. Click on the "Done" button in the bottom right
1. Click on the "Visualization" button in the bottom left
1. Select "Pie". Then pick the gear for Pie options
1. We are going to create a Pie chart that shows the percent per interview rating
1. Ensure the Dimension is set to "Xsipres Rating" and the Measure is set to "Count"
1. Click on the "Save" button, top right
1. Give the Report a name. Like "IIP Results"
1. Put it in your school's collection

## 4.5 Create an Insights card with the visulization
1. From Experience dashboard, pick the menu (top left) to go to "Configuration".
1. Click the "Add Card" button in the top right
1. Pick "Insights" for the card template
1. Add a card title like "IIP Ratings"
1. Add the required description
1. Add one or more Card tags
1. Pick "Configuration"
1. Navigate through your school collection, Individual Reports, and find the visualization you created.
1. It should render with a bit of a delay in the Card Preview to the right.
1. Pick appropriate roles to view this card. For instance a role that Advisors would have.
1. Click Next and Finish
1. The card is now available to be bookmarked by an advisor.

# 5. Upload and configure the extension
## 5.1 Upload extension
1. Edit extension.js and add a publisher
1. Open a terminal and cd to the extension directory.
1. run "npm install"
1. copy the sample.env to .env and add values as needed. Including the upload token from Experience Setup
1. You might want to uncomment the EXPERIENCE_EXTENSION_ENABLED and EXPERIENCE_EXTENSION_ENABLED lines in .env and set appropriate values
1. Run one of the npm scripts to upload the extenion, such as "npm run deploy-dev"
1. If needed, find the extension in Experience Setup and enable it for the desired Environment. Probably just Test for now. No need for a shared secret

## 5.2 Configure the extension
1. Navigate to Experience -> Configuration and find the "Intelligent Interview Prep" card. Click on the "Edit" from the action menu.
1. Add one or more required Card tags
1. Select the configuration step
1. Enter the name of the Academic Program Pipeline as you created it in 3.3.3 - Mine is named "elive2024-get-program"
1. Enter the name of the Generate Company Info Pipeline as you created it in 3.4.3 - Mine is named "elive2024-get-generate-company-info"
1. Enter the name of the Generate Interview Tips Pipeline as you created it in 3.5.3 - Mine is named "elive2024-get-generate-interview-tips"
1. Enter the name of the Generate Interview Response Pipeline as you created it in 3.6.3 - Mine is named "elive2024-post-generate-interview-response"
1. Enter the name of the IIP Results Pipeline as you created it in 3.7.3 - Mine is named "elive2024-post-iip-results"
1. Enter the request interview Workflow ID from step 6.1.20
1. Enter the request coaching Workflow ID from step 6.4.27
1. Enter the Ethos API Key you want the pipelines for this extension to use. It will need access to the Ethos resources used by the pipelines, including the custom table API resource
1. Enter your OpenAi API Key
1. Pick appropriate roles. I chose student, but the could be limited to an ERP role that only include senior level students.
1. Click Finish

# 6. Setup and Configure Ellucian Intelligent Processes

Note, when creating the external task and the action, if you use the names as defined here, you will be able to import the workflow from the YAML file.

## 6.1 Create an External Task for the extension
1. Launch Maestro Designer from the App Menu.
1. Pick "External Tasks" from the left navigation
1. Click on "+ NEW" button to create a new external task
1. Enter a task name. I used "Intelligent Interview Prep"
1. Enter a description. I used "Launches Intelligent Interview Prep"
1. The Code will be generated from the task name. You can change this if you desire to before you save it the first time.
1. Under External Location enter a Route (note this is the route path expectect in the extension with the task ID). Enter "/${taskId}"
1. Enter the Publisher. This is the publisher you used in the extension's extension.js
1. Enter the extension name from the extension.js. "intelligent-interview-prep"
1. Enter the launch card type from the extension.js. "LaunchCard"
1. Enter the Account ID - See note below for how to get the account ID.
1. Enter the contents of intelligent-processes/iip-extension-external-task-def.json into the External Task Definition JSON block
1. Click on the "SAVE" button.
1. After the save a snack message should show it is ready to be published. Click the "PUBLISH" button.
1. You will need to grant permission to your user in Maestro to the newly created External Task
1. Go to Experience Setup -> Permissions
1. Search for maestro-experience-modeler
1. Pick "Created External Tasks". Then pick the task you created.
1. Select a role or user that will allow your Experience user to Use the external task.
1. Click Save

Note: To get the Account ID for step 6.1.11, open a browser tab and go to https://jwt.io/ Paste your Experience extension upload token as the value in the "Encoded" value. It will decode the token. One of the attributes is "accountId". Use this value as the value for Account ID in when creating the External Task.

## 6.2 Create EIP Action to get student's advisor
1. Launch Maestro Designer from the App Menu.
1. Pick "Actions" from the left navigation.
1. Click on "+ NEW" to create a new workflow
1. Enter a name. I used "Get Students Advisor"
1. Enter a description.
1. The Code will be generated from the action name. You can change this if you desire to before you save it the first time.
1. Enter the pipeline name. In my case I used "elive2024-get-student-advisor"
1. Enter the API Key you wish this pipeline to use to get the student's advisor. See the pipeline defined in step 3.2
1. Enter the contents of intelligent-processes/get-student-advisor-action-def.json into the Action Definition JSON block
1. Click on the "SAVE" button.
1. After the save a snack message should show it is ready to be published. Click the "PUBLISH" button.
1. You will need to grant permission to your user in Maestro to the newly created Action
1. Go to Experience Setup -> Permissions
1. Search for maestro-experience-modeler
1. Pick "All Actions". Then pick the action you created. Mine is "Get Students Advisor"
1. Select a role or user that will allow your Experience user to Use the action.
1. Click Save

## 6.3 Create the Request Intelligent Interview Prep workflow - by import
1. Launch Maestro Designer from the App Menu.
1. Pick "Workflows" if needed from the left navigation.
1. Click on the Upload YAML button. Find intelligent-processes/Request Intelligent Interview Prep.maestro.yaml. Click on the Open button
1. Click on the Start block, then click on the Save button
1. After the ready to publish message, click on the Publish button
1. Collect the workflow ID. This is in the browser URL as the last value in the URL path. For instance, in my case my URL is: https://experience-test.elluciancloud.com/bprod/app/all-accounts/Ellucian/maestro-experience-modeler/workflow/b6f2d056-306a-4a9b-8719-2b7d1dbee497
My workflow ID is "b6f2d056-306a-4a9b-8719-2b7d1dbee497". Note this value is needed in the card configuration in step 5.2.5
1. You will need to grant permission to the student users to Execute this workflow.
1. Got to Experience Setup -> Permissions
1. Search for maestro-experience-modeler
1. Pick "All Workflows". Then pick the workflow you created. Mine is named Request Intelligent Interview Prep
1. Select a role or user that will allow your student users to Execute the workflow. In my case I am using the EEDM Role "student"

## 6.3 Create the Request Intelligent Interview Prep workflow - recreate using the UI
1. Launch Maestro Designer from the App Menu.
1. Pick "Workflows" if needed from the left navigation.
1. Click on "+ NEW" to create a new workflow
1. Enter a name. I used "Request Intelligent Interview Prep"
1. Optionally add a description.
1. Pick the "API" trigger.
1. Click on "GET STARTED"
1. Click on the "Start" block.
1. You can view the properties and parameters, but no change is needed.
1. Click on the "+" below the "Start" block.
1. Pick External from the Tasks in the left navigation.
1. In the Search Available Task, enter at least 3 characters in the name of your external task from 6.1.4
1. Select your external task and click the "ADD TASK" button
1. In the Assignment section on the right, pick "Workflow Data" for the Select assignee(s)
1. Pick "Started For" for the Assignee
1. Enter a value for the Due In field. I entered 14 days.
1. Make sure the "Experience Notification" is toggled to the ON position.
1. Click the "+" after the External Task, then pick Flow Control - Split. This will add a left and right route. The route on the right will be the "Completed - Request Coaching"
1. Click on the "+" on the right route
1. Pick Action from the Integrations in the left navigation.
1. In the Search Available Task, enter at least 3 characters in the name of your action from 6.2.4. Mine is "Get Students Advisor"
1. Select your action and click the "ADD ACTION" button
1. In the right panel, look for Query Parameter Setup and click the "+"
1. In the dialog, select Started For as the Process Data for "Student Id" and click on "DONE"
1. In the designer, click the "+" button below the "Get Student Advisor" block
1. From the left navigation, pick Approval from Tasks
1. In the right panel, change the Block (name) to "Provide Interview Coaching". Note this is the label shown to the advisor when the task is assigned
1. In the right panel, find the Task Outcomes
1. Edit the Default Outcome (Approve) and change it to "Student was coached"
1. Edit the Second Outcome (Deny) and change it to "Student was NOT coached"
1. In the Assignment section, pick Workflow Data for the Select Assignee(s).
1. Pick "Advisor Id" in the Assignee field.
1. Enter a value for the Due In field. I entered 14 days.
1. Make sure the "Experience Notification" is toggled to the ON position.
1. Click on the "SAVE" button in the top right. You should get a "Ready to publish" snackbar message
1. Click on the "PUBLISH" button.
1. Collect the workflow ID. This is in the browser URL as the last value in the URL path. For instance, in my case my URL is: https://experience-test.elluciancloud.com/bprod/app/all-accounts/Ellucian/maestro-experience-modeler/workflow/b6f2d056-306a-4a9b-8719-2b7d1dbee497
My workflow ID is "b6f2d056-306a-4a9b-8719-2b7d1dbee497". Note this value is needed in the card configuration in step 5.2.5
1. You will need to grant permission to the student users to Execute this workflow.
1. Got to Experience Setup -> Permissions
1. Search for maestro-experience-modeler
1. Pick "All Workflows". Then pick the workflow you created. Mine is named Request Intelligent Interview Prep
1. Select a role or user that will allow your student users to Execute the workflow. In my case I am using the EEDM Role "student"

# 7. Use Cases

## 7.1. Student Use Case
1. Login to Experience as a student user.
1. Find and optionally bookmark the Intelligent Interview Prep card.
1. Click on the "Sign up for a mock interview" button. This will show a snackbar message stating the Interview Requested
1. Refresh the browser to see the assigned task in the Maestro Tasks card or in the production Experience, it will show up as a Notification in the top navigation.
1. From the notification or the Maestro Tasks card, click on the link to "Intelligent Interview Prep"
1. Interact with the page and the interview chat. At the end of the interview, you will be asked "Would you like to request coaching from your advisor?". If you pick the yes option, it will initiate a workflow assigned to the student's advisor requesting a coaching sesion.

## 7.2. Advisor Use Case
1. Login to Experience as an Intelligent Interview Prep studunt's advisor.
1. From the notification or the Maestro Tasks card, click on th elink to "Approval Task". This will open the Maestro view of the task assigned to the advisor.
1. The advisor can then complete the task after acknowledging the student was or was not coached.


Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
