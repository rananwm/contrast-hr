import React from 'react'
import { StyleSheet } from 'react-native';
import { MDivider, MText, MButton, MView} from './MComponents'

export const Event = ({ event }) => {

const formatEventDescription = (eventDescription) => {
      // if the event description is null, return an empty string
      if (!eventDescription) {
            return "";
      }

      // convert p tags to newlines and then remove all html tags
      // let formattedDescription = eventDescription.replace(/<p.+?>/mg, "\n");
      let formattedDescription = eventDescription.replace(/(<([^>]+)>)/gi, "");
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


return (
    <MView style={{flex: 1, margin: 20, marginTop: 40, justifyContent: 'space-between'}}>
        <MView disabled="True">
            <MText style={styles.heading} variant="headlineMedium">{event.name}</MText>
            <MView style={styles.eventMetadata}>
                <MText style={styles.employer} variant="bodyLarge">{event.employer}</MText>
                <MText variant="bodyLarge">{event.location}</MText>
            </MView>
            <MButton style={styles.action} textColor="#ffffff">RSVP NOW</MButton>
        </MView>

        <MView disabled="True">
            <MText style={styles.eventShortDescription} variant="bodyLarge">{formatEventDescription(event.description)}</MText>
            <MDivider></MDivider>
            <MText style={styles.eventFullDescription} variant="bodyLarge">{formatEventDescription(event.description_full)}</MText>
            <MButton style={styles.action} textColor="#ffffff">RSVP NOW</MButton>
        </MView>
    </MView>
)
}

const styles = StyleSheet.create({
      eventMetadata: {
            flexDirection: 'column',
      },
      eventShortDescription: {
            marginTop: 10,
            marginBottom: 30
      },
      eventFullDescription: {
            marginTop: 10,
            marginBottom: 10
      },
      heading: {
            marginBottom: 15,
            justifyContent: 'flex-start'
      },
      action: {
            margin: 10,
            marginTop: 20,
            backgroundColor: '#009dce',
            borderColor: '#009dce'
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