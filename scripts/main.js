let myForm = document.getElementById('mainForm');
let textArea = document.getElementById('embedCode')
let videoLink = document.getElementById('link');

let videoID = '';
let videoTimeEmbed = '';
let videoTimeLink = '';

let key = 'AIzaSyDv1p9Yae1_42wMx_jivmfiGhoBPzVKElk';
let URL = 'https://youtube.googleapis.com/youtube/v3/videos';

mainForm.onsubmit = function () {
  try {
    videoID = getIDFromLink(videoLink.value)[1];
    console.log(getIDFromLink(videoLink.value)[2]);
    if (getIDFromLink(videoLink.value)[2]) videoTimeEmbed = `?start=${getIDFromLink(videoLink.value)[2]}`, videoTimeLink = `?t=${getIDFromLink(videoLink.value)[2]}`;
    else videoTimeEmbed = '', videoTimeLink = '';
    getEmbedCode(videoID);
  } catch(e) {
    $( "div.preview" ).html ( `<p>Please enter a valid YouTube link.</p>` );
    textArea.value = 'Please enter a valid YouTube link.';
  }
  return false;
}

function getIDFromLink(link) {
  try {
  let linkPattern = /(?:https:\/\/www.youtube.com\/watch\?v=|https:\/\/youtu.be\/)([a-zA-Z0-9._%+-]+)(?:\?t=([0-9]+))?/;
  return linkPattern.exec(link);
  } catch(e) {
    $( "div.preview" ).html ( `<p>Please enter a valid YouTube link.</p>` );
    textArea.value = 'Please enter a valid YouTube link.';
  }
}

function getEmbedCode(id) {
  function changeTimeFormat(isoDuration) {
    let [_, hours, minutes, seconds] = /PT(\d{1,2}H)?(\d{1,2}M)?(\d{1,2}S)?/.exec(isoDuration);
    function changeUnit(unit) {
      if (unit) {
        unit = unit.slice(0, -1);
        if (unit.length == 1) unit = unit.padStart(2, '0');
      }
      else unit = '00';
      return unit;
    }
    hours = changeUnit(hours);
    minutes = changeUnit(minutes);
    seconds = changeUnit(seconds);
    if (hours != '00') {
      return `${hours}:${minutes}:${seconds} hrs.`;
    }
    else {
      return `${minutes}:${seconds} min.`;
    }
  }
  // function changeTimeFormat(isoDuration) {
  //   let hoursPattern = /([0-9]*)H/;
  //   let minutesPattern = /([0-9]*)M/;
  //   let secondsPattern = /([0-9]*)S/;

  //   function makeString(unit) {
  //     let timeString = '';
  //     if (unit == null) timeString = '00';
  //     else if (unit[1].length == 1) timeString = '0' + unit[1];
  //     else timeString = unit[1];
  //     return timeString;
  //   }

  //   let hoursString = makeString(hoursPattern.exec(isoDuration));
  //   let minutesString = makeString(minutesPattern.exec(isoDuration));
  //   let secondsString = makeString(secondsPattern.exec(isoDuration));

  //   if (hoursString != '00') {
  //     return time = hoursString + ':' + minutesString + ':' + secondsString + ' hrs.'
  //   }
  //   else {
  //     return time = minutesString + ':' + secondsString + ' min.';
  //   }
  // }

  let options = {
    part: 'snippet,contentDetails',
    key: key,
    id: id
  }

  getVideoDetails();

  //Possibly should use Fetch instead? https://stackoverflow.com/a/43175774
 function getVideoDetails () {
  $.getJSON(URL, options, function(data) {
    try {
      let title = data.items[0].snippet.title;
      let duration = changeTimeFormat(data.items[0].contentDetails.duration);
      let uploadDate = data.items[0].snippet.publishedAt; // Get upload date
      let channelTitle = data.items[0].snippet.channelTitle; // Get channel title

      // Use the retrieved data to create the embed code
      let embedCode = `
        <p><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}${videoTimeEmbed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>
        <p>If the video doesn't appear, follow this direct link: <a class="inline_disabled" href="https://youtu.be/${videoID}${videoTimeLink}" target="_blank" rel="noopener">${title}</a> (${duration})</p>
        <p>Use the direct link above to open the video in YouTube to display the video captions, expand the video, and navigate the video using the transcript.</p>
        
        <p>Uploaded: ${uploadDate} by ${channelTitle}</p>
      `;
      textArea.value = embedCode;
      $( "div.preview" ).html ( embedCode );
    } catch(e) {
      $( "div.preview" ).html ( `<p>Please enter a valid YouTube link.</p>` );
      textArea.value = 'Please enter a valid YouTube link.'
    }
  })
}
}
