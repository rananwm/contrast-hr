# Exportdata Expo App

Cross-platform react native app for exportdata.ca

## Data entry helpers etc...

The following JavaScript can be used on the skills page to get all the toggle values for the config (in case these are updated this will save time)

```var config = []
let switches = document.querySelectorAll('.switch-input');
for (var i = 0; i < switches.length; i++) {
    let switchLabel = switches[i].parentElement.parentElement.children[0].innerText;
    config.push({"key": switches[i].name, "label": switchLabel});
}

console.log(JSON.stringify(config));```

More scripts can be found in the data_entry_helpers folder - simply paste the script onto the website in the console

## Building the apps

You can build all apps with the follwoing command:
`eas build --platform all`

Once built it can be pushed to app store connect and google play:
`eas submit --platform ios`
`eas submit --platform android`

Sign in is required and Google play is tricky as the first build needs to be uploaded manually - manual upload is a simple matter of creating a new track and then dropping in the aab file (found on the build screen in expo via download).