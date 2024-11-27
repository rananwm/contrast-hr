import React from 'react'
import { MCard } from './MComponents'

export const EventCard = (props) => {
    const { event, action, style } = props
    const key = "event_" + event.id
    const description = event.short_description.replace(/(\r\n|\n|\r)/gm, " ")
    const displayDescription = description.length > 100 ? description.substring(0, 100) + "..." : description
    const title = event.name;
    const subtitle = "";
    const body = displayDescription;
    const cta = "Register";
    const metadata = [
      {label: "Location", value: event.location, icon: 'globe'},
      // {label: "Deadline", value: event.deadline, icon: 'calendar'},
      {label: "Employer", value: event.date, icon: 'clock'}
    ]
    // title, subtitle, body, cta, metadata
    return (
      <MCard
        key={key}
        style={style}
        onPress={action}
        title={title}
        subtitle={subtitle}
        body={body}
        // cta={cta}
        metadata={metadata}
        icon="calendar"
      ></MCard>
    )
}