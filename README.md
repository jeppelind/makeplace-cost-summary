## MakePlace Cost Summary

### Overview

Dashboard displaying latest marketboard prices for items in FFXIV, based on selected server cluster.  
Parses MakePlace files (.list.txt) made in [MakePlace](https://makeplace.app/) and fetches current price for the items present in the file. End result is presented in the UI.

Live site is running at: https://makeplace-cost-summary.netlify.app/

Example save file "ExampleData.list.txt" is found in the root of the repo.

### Data

Item IDs fetched from [xivapi](https://xivapi.com/).

The market price data is fetched from the [Universalis REST API](https://universalis.app).


### Structure
* [Next.js](https://nextjs.org/) project with a mix of server- and clientside rendered components.  
* Client side state management handled by [Jotai](https://jotai.org/).  
* [Tailwind CSS](https://tailwindcss.com/) used for styling.
