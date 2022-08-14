function onSubmit(e) {
  var items = e.response.getItemResponses();
  var map = {};
  for (i in items){
    map[items[i].getItem().getTitle()] = items[i].getResponse();
  }
  Logger.log(JSON.stringify(map));
  
  var k = 2; //index constant

  var avgStVal = avgStars(map);
  var ppPortion = pricePerPort(map).toFixed(2);
  var normalPPP = normalizePPP(map, ppPortion);

  var preIndexed = avgStVal / Math.log(k + normalPPP);

  var final = preIndexed.toFixed(2);

  var baseUrl = "http://drive.google.com/uc?export=view&id=";
  var photoId = map["Photo of Restaurant"][0];
  Logger.log(photoId);
  var photoFile = DriveApp.getFileById(photoId);
  photoFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
  var photoUrl = baseUrl + photoId;
  Logger.log(photoUrl);

  var endpoint = 'https://hooks.slack.com/services/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'
  var payload = {
  "text" : "A new DEAL rating for " + map['Restaurant Name'] + " has been submitted. Check it out now!",
    "blocks": [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Hello crandonian food eaters! A new D.E.A.L. rating has been posted. Your fellows *" + map['Judges'] +  "* have decided to rank *" + map['Restaurant Name'] +  "* in *" + map['Location'] +  "*. \n\n "
            }
        },
    {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*See below for the final rating along with comments and photos:*"
            }
    },
        {
            "type": "image",
            "image_url": photoUrl,
            "alt_text": "restaurant"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Final Rating* \n *" + final +  "* \n " + giveMessage(final, map) + "\n\n *Average Ratings:*\n *Ambiance:* " + getAverage(map, 'Ambiance') + "\n *Service:* " + getAverage(map, 'Service') + "\n *Presentation:* " + getAverage(map, 'Presentation') + "\n *Taste:* " + getAverage(map, 'Taste') + "\n *Affect:* " + getAverage(map, 'Affect') + "\n *It Factor:* " + getAverage(map, 'It Factor') + "\n \n *Average Price per Portion:* " + ppPortion + "\n *Current Weights:* Ambiance - " + ambW + ", Service - " + serW + ", Presentation - " + preW + ", Taste - " + tasW + ", Affect - " + affW + ", It Factor - " + itW + ", Indexing Constant - " + k
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Comments* \n " + map['Final Review']
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Restaurant ",
                        "emoji": true
                    },
          "value": "click_me_123",
                    "url": "http://www.google.com/search?q=" + map['Restaurant Name'] + "%20" + map['Location']
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Judges",
                        "emoji": true
                    },
                    "value": "click_me_123",
                    "url": "https://www.brown.edu/Athletics/Mens_Ultimate/roster.html"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Fill out Rating Form ",
                        "emoji": true
                    },
          "value": "click_me_123",
                    "url": "https://docs.google.com/forms/d/e/1FAIpQLSe6qeDFJd6HzArD-gNOj7KSobRErkgUFI63pTSo-N2u8H4IUA/viewform?usp=sf_link"
                }
            ]
        }
    ]
}

  var options = {
  'method' : 'post',
  'contentType': 'application/json',
  'payload' : JSON.stringify(payload),
  'muteHttpExceptions': false
  };
  UrlFetchApp.fetch(endpoint, options);


}

function giveMessage(final, map){
  console.log(final);
  if(final<1.5){
    return "as far as " + map['Type of Meal'] + " goes, *" + map['Restaurant Name'] + "* is the absolute worst DEAL.";
  } else if (1.5 <= final && final < 2.5){
    return "eh, I'm not so sure about going to *" + map['Location'] + "* just to get some *" + map['Restaurant Name'] + "*.";
  } else if (2.5 <=final && final < 3.2){
    return "as far as " + map['Type of Meal'] + " goes, *" + map['Restaurant Name'] + "* is just alright. Probably not worth going all the way to *" + map['Location'] + "*.";
  }  else if (3.2 <=final && final < 4){
    return "okay big fella, now we're getting there. I might take a gander to *" + map['Location'] + "* in order to eat at *" + map['Restaurant Name'] + "*.";
    }  else if (4 <=final && final < 4.5){
    return "As far as DEALs go, *" + map['Restaurant Name'] + "* is a dap. I might start vacationing in *" + map['Location'] + "* just to get some more of that good good.";
    }
  else {
    return "Now that's a banger of a deal! *" + map['Restaurant Name'] + "* is the place to be, especially in *" + map['Location'] + "*.";
  }

}

function getAverage(map, name){
   var value = map[name];
  var sum = 0;
  var length = 0;

  for (i in value){
    if (value[i] != null){
      sum += Number(value[i]);
      length++;
    }
  }
  return sum/length;


}

function pricePerPort(map){
  var ppM = Number(map['Total Cost']) / Number(map['Number of Judges']);
  var avgP = getAverage(map, 'Portion (relative to average meal of that type)')
  return ppM/avgP;

}

  var ambW = 1;
  var serW = .8;
  var preW = .7;
  var affW = .8;
  var tasW = 1.8;
  var itW = 1.3;

  var fastFood = 5;
  var breakfast = 11;
  var lunch = 14;
  var dinner = 17;



function normalizePPP(map, ppPortion){
  if (map['Type of Meal'] == 'Fast Food Breakfast'){
    return ppPortion / fastFood;
  } else if (map['Type of Meal'] == 'Breakfast'){
    return ppPortion / breakfast;
  } else if (map['Type of Meal'] == 'Lunch'){
    return ppPortion / lunch;
  } else if (map['Type of Meal'] == 'Dinner'){
    return ppPortion / dinner;
  } else{
      console.log('oops');
  }
}

function avgStars(map){





  var list = [];
  list.push(ambW * (getAverage(map, 'Ambiance')));
  list.push(serW * (getAverage(map, 'Service')));
  list.push(preW * (getAverage(map, 'Presentation')));
  list.push(affW * (getAverage(map, 'Affect')));
  list.push(tasW * (getAverage(map, 'Taste')));
  list.push(itW * (getAverage(map, 'It Factor')));

  var sum = 0;
  for (i in list){
    sum += list[i];
  }
  return sum / 6;

}





