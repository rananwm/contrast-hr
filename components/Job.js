import React from 'react'
import { StyleSheet } from 'react-native';
import * as linking from 'expo-linking';
import { A } from '@expo/html-elements';
import { MDivider, MText, MButton, MView} from '../components/MComponents'

export const Job = ({ job }) => {

const deadline = job.deadline?<MText style={styles.deadline}>Deadline: {job.deadline}</MText>:<MText></MText>;

const handleApply = (job_application_link) => {
      // if the job application link is an email, open the email app
      // otherwise, open the link in the browser (and ensure it starts with http:// or https://)
      if (job_application_link.includes('@')) {
            linking.openURL('mailto:'+job_application_link).catch(err => "Silence is golden.");
      } else {
            if (!job_application_link.startsWith('http://') && !job_application_link.startsWith('https://')) {
                  job_application_link = 'https://' + job_application_link;
            } else {
                  job_application_link = job_application_link;
            }
            linking.openURL(job_application_link).catch(err => "Silence is golden.");
      }
}

const formatJobDescription = (jobDescription) => {
      // if the job description is null, return an empty string
      if (!jobDescription) {
            return "";
      }

      // convert p tags to newlines and then remove all html tags
      // let formattedDescription = jobDescription.replace(/<p.+?>/mg, "\n");
      let formattedDescription = jobDescription.replace(/(<([^>]+)>)/gi, "");
      // replace tabs with a newline with a newline
      formattedDescription = formattedDescription.replace(/([\t\s ]{1,}\n)/g, "\n");
      formattedDescription = formattedDescription.replace(/(\r\n){1,2}/gm, "\n");
      // replace &nbsp; with a space
      formattedDescription = formattedDescription.replace(/&nbsp;/g, " ");
      // &amp; is the html entity for the ampersand character
      formattedDescription = formattedDescription.replace(/&amp;/g, "&");
      // &quot; is the html entity for the double quote character
      formattedDescription = formattedDescription.replace(/(&quot;|&rsquo;|&lsquo;)/g, '"');
      // replace ' char code with '
      formattedDescription = formattedDescription.replace(/&#39;/g, "'");
      // replace multiple spaces or tabs with a single space
      formattedDescription = formattedDescription.replace(/[\t]+/g, "- ");

      return formattedDescription;
}

const getJobApplicationAction = (job) => {
      const job_application_link = job.job_application_link;
      let job_application_type = 'link';
      if (job_application_link) {
            if (job_application_link.includes('@')) {
                  job_application_type = 'email';
            }
      }
      return (
            <MView>
                  {job_application_type == 'link'?
                        <MButton onPress={() => handleApply(job_application_link)} style={styles.actionButton} textColor="#ffffff">APPLY NOW</MButton>
                        :
                        <MText onPress={() => handleApply(job_application_link)} style={styles.actionText}>
                              Contact: {job_application_link}
                        </MText>
                  }
            </MView>
      )

}

return (
    <MView style={{flex: 1, margin: 20, marginTop: 40, justifyContent: 'space-between'}}>
        <MView disabled="True">
            <MText style={styles.heading} variant="headlineMedium">{job.name}</MText>
            <MView style={styles.jobMetadata}>
                <MText style={styles.employer} variant="bodyLarge">{job.employer}</MText>
                <MText variant="bodyLarge">{job.location}</MText>
            </MView>
            {job.job_application_link?getJobApplicationAction(job):null}
        </MView>

        <MView disabled="True">
            <MText style={styles.jobShortDescription} variant="bodyLarge">{formatJobDescription(job.description)}</MText>
            <MDivider></MDivider>
            <MText style={styles.jobFullDescription} variant="bodyLarge">{formatJobDescription(job.description_full)}</MText>
            {job.job_application_link?getJobApplicationAction(job):null}
        </MView>
    </MView>
)
}

const styles = StyleSheet.create({
      jobMetadata: {
            flexDirection: 'column',
      },
      jobShortDescription: {
            marginTop: 10,
            marginBottom: 30
      },
      jobFullDescription: {
            marginTop: 10,
            marginBottom: 10
      },
      heading: {
            marginBottom: 15,
            justifyContent: 'flex-start'
      },
      actionButton: {
            margin: 10,
            marginTop: 20,
            backgroundColor: '#009dce',
            borderColor: '#009dce'
      },
      actionText: {
            fontSize: 18,
            fontWeight: 'bold'
      },
      employer: {
            color: '#E85100',
            marginRight: 4
      },
      deadline: {
            marginTop: 5,
            color: '#E85100'
      }
})