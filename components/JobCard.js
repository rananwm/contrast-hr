import React from 'react'
import { MCard } from './MComponents'

export const JobCard = (props) => {
    const { job, action, style } = props
    const key = "job_" + job.id
    const description = job.description.replace(/(\r\n|\n|\r)/gm, " ")
    const displayDescription = description.length > 100 ? description.substring(0, 100) + "..." : description
    const title = job.name;
    const subtitle = "";
    const body = displayDescription;
    const cta = "More Information";
    const metadata = [
      {label: "Location", value: job.location, icon: 'globe'},
      // {label: "Deadline", value: job.deadline, icon: 'calendar'},
      {label: "Employer", value: job.employer, icon: 'person'}
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
        cta={cta}
        metadata={metadata}
        icon="account-hard-hat"
      ></MCard>
    )
}