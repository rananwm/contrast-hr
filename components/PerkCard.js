import React from 'react'
import { MCard } from './MComponents'

export const PerkCard = (props) => {
    const { perk, action, style } = props
    const key = "perk_" + perk.id
    const description = perk.description.replace(/(\r\n|\n|\r)/gm, " ")
    const displayDescription = description.length > 100 ? description.substring(0, 100) + "..." : description
    const title = perk.name;
    const subtitle = "";
    const body = displayDescription;
    const cta = "Learn More";
    // const metadata = [
    //   {label: "Location", value: perk.location, icon: 'globe'},
    //   // {label: "Deadline", value: perk.deadline, icon: 'calendar'},
    //   {label: "Employer", value: job.employer, icon: 'person'}
    // ]
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
        // icon="account-hard-hat"
      ></MCard>
    )
}