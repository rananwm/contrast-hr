import React from 'react'
import { MCard } from './MComponents'

export const TrainingCard = (props) => {
    const { training, action, style } = props
    const key = "training_" + training.id
    const description = training.short_description.replace(/(\r\n|\n|\r)/gm, " ")
    const displayDescription = description.length > 100 ? description.substring(0, 100) + "..." : description
    const title = training.name;
    const subtitle = "";
    const body = displayDescription;
    const cta = "Register";
    const metadata = [
      {label: "Location", value: training.location, icon: 'globe'},
      // {label: "Deadline", value: training.deadline, icon: 'calendar'},
      {label: "Employer", value: training.date, icon: 'clock'}
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
        icon="school"
      ></MCard>
    )
}