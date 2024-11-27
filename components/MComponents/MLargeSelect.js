import * as React from 'react';
import MView from "./MView";
import MButton from "./MButton";
import MInput from './MInput';

const MLargeSelect = (props) => {
  const [dirty, setDirty] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const updateValue = (option) => {
    setDirty(true)
    setSearchText(option.label)
    props.setValue(option.value);
  }

  const updateSearchText = (text) => {
    setDirty(true)
    setSearchText(text)
  }

  const selectedItem = props.list.find(item => item.value === props.value);

  let selectedText = ""
  if (selectedItem) {
    selectedText = selectedItem.label;
    // setSearchText(selectedText)
  }

  const defaultValue = searchText=="" && selectedText!="" && !dirty ? selectedText : searchText

  // get list from props - these are a list of objects {label: "label", value: "value"}
  return (
  <MView>
    {/* <MText>
        {selectedText}
    </MText> */}
    <MInput
        style={{marginBottom: 10}}
        key="band_search"
        placeholder={props.placeholder}
        value={defaultValue}
        onChangeText={updateSearchText}
    />
    <MView style={{marginLeft: 10}}>
        {/* filter the top 3 option labels that match the searchText */}
        {props.list
        .filter(option => option["label"].toLowerCase().includes(defaultValue.toLowerCase()))
        .slice(0,3)
        .map((option, index) => {
            const icon = option.value == props.value ? "check" : "";
            return (
                <MView key={index} style={{margin: 4}}>
                    <MButton icon={icon} onPress={() => updateValue(option)}>
                        {option.label} 
                        {/* ({option.value}) */}
                    </MButton>
                </MView>
            )}
        )}
    </MView>
  </MView>
)};

export default MLargeSelect;