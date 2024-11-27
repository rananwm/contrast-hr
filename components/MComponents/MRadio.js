import * as React from 'react';
import { RadioButton } from 'react-native-paper';

const MRadio = (props) => {
    return (
        <RadioButton.Group {...props}>
            {props.list.map((child, index) => (
                <RadioButton.Item key={index} label={child.label} value={child.value} />
            ))}
        </RadioButton.Group>
    )
}

export default MRadio;