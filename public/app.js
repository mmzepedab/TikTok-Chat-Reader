let ioConnection = new io();

let passengersCount = 0;
let passengersBusinessCount = 0;
let passengersFirstClassCount = 0;
let viewerCount = 0;
let likeCount = 0;
let diamondsCount = 0;

const usersBoughtTicket = [];
const usersBoughtBusinessTicket = [];
const usersBoughtFirstClassTicket = [];

/*
$(document).ready(() => {
    $('#connectButton').click(connect);
    $('#uniqueIdInput').on('keyup', function (e) {
        if (e.key === 'Enter') {
            connect();
        }
    });
})*/

$(document).ready(() => {
  connect();
  textOverlay();
});

function connect() {
  //let uniqueId = $('#uniqueIdInput').val();
  let uniqueId = "elmeichon";
  if (uniqueId !== "") {
    ioConnection.emit("setUniqueId", uniqueId, {
      enableExtendedGiftInfo: true,
    });
    $("#stateText").text("Connecting...");
  } else {
    alert("no username entered");
  }
}

function sanitize(text) {
  return text.replace(/</g, "&lt;");
}

function updateRoomStats() {
  //$('#roomStats').html(`Viewers: <b>${viewerCount.toLocaleString()}</b> Likes: <b>${likeCount.toLocaleString()}</b> Earned Diamonds: <b>${diamondsCount.toLocaleString()}</b>`)
  $("#roomStats").html(
    `FIRST CLASS(👑): <b>${passengersFirstClassCount.toLocaleString()}</b> BUSINESS(🌹): <b>${passengersBusinessCount.toLocaleString()}</b> 
    ECONOMY(Ticket): <b>${passengersCount.toLocaleString()}</b> TOTAL PASAJEROS: <b>${
      passengersCount + passengersFirstClassCount + passengersBusinessCount
    }</b>`
  );
}

function generateUsernameLink(data) {
  if (data.displayType === "share") {
    return `<a class="businessClassLink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.uniqueId}</a>`;
  } else {
    return `<a class="usernamelink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.uniqueId}</a>`;
  }
}

function isPendingStreak(data) {
  return data.gift.gift_type === 1 && data.gift.repeat_end === 0;
}

function addChatItem(color, data, text, summarize) {
  let container = $(".chatcontainer");

  if (container.find("div").length > 500) {
    container.find("div").slice(0, 200).remove();
  }

  container.find(".temporary").remove();

  container.append(`
        <div class=${summarize ? "temporary" : "static"}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> 
                <span style="color:${color}">${sanitize(text)}</span>
            </span>
        </div>
    `);

  container.stop();
  container.animate(
    {
      scrollTop: container[0].scrollHeight,
    },
    400
  );
}

function addTicketItem(color, data, text, summarize) {
  let container = $(".chatcontainer");
  /*
  if (container.find("div").length > 500) {
    container.find("div").slice(0, 200).remove();
  }

  container.find(".temporary").remove();
*/
  container.append(`
  <div class=${summarize ? "temporary" : "static"}>
        <div class="ticketcontainer" style="background-color: ${color}">
        <div class="ticketheader">
            <img class="ticketLogo" src="./images/latam_logo.png">
            <div style="color: white; height: 100%; 
            position: absolute; right: 0;
    top: 0; float:right; height: 100px; line-height: 100px; margin-right: 100px;">
                <b>TARJETA DE EMBARQUE N°</b>
            </div>
        </div>

        <div>
            <table style="width: 100%;">
                <tr>
                    <td><img class="miniprofilepicture" src="${
                      data.profilePictureUrl
                    }"></td>
                    <td>
                        <span style="vertical-align: top;">
                            <h3>NOMBRE PASAJERO</h3>
                        </span>
                        <span style="vertical-align: top;">
                            <h1>${generateUsernameLink(data)}</h1>
                        </span>
                    </td>
                    <td>
                        <span style="vertical-align: top;">
                            <h3>CLASE</h3>
                        </span>
                        <span style="vertical-align: top;">
                            <h1>${text}</h1>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>
                    <img class="gifticon" src="${
                      (
                        data.extendedGiftInfo?.icon ||
                        data.extendedGiftInfo?.image
                      )?.url_list[0]
                    }">
                    </td>
                    <td>
                        <span style="vertical-align: top;">
                            <h3>SALIDA</h3>
                        </span>
                        <span style="vertical-align: top;">
                            <h1>PANAMA CITY, PANAMA</h1>
                        </span>
                    </td>
                    <td>
                        <span style="vertical-align: top;">
                            <h3>DESTINO</h3>
                        </span>
                        <span style="vertical-align: top;">
                            <h1>MEDELLIN, COLOMBIA</h1>
                        </span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    </div>
    `);

  window.scrollTo(0, document.body.scrollHeight);
}

function addGiftItem(data) {
  let container = $(".giftcontainer");

  if (container.find("div").length > 200) {
    container.find("div").slice(0, 100).remove();
  }

  let streakId = data.userId.toString() + "_" + data.giftId;

  let html = `
        <div data-streakid=${isPendingStreak(data) ? streakId : ""}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> <span>${
    data.extendedGiftInfo.describe
  }</span><br>
                <div>
                    <table>
                        <tr>
                            <td><img class="gifticon" src="${
                              (
                                data.extendedGiftInfo.icon ||
                                data.extendedGiftInfo.image
                              ).url_list[0]
                            }"></td>
                            <td>
                                <span>Name: <b>${
                                  data.extendedGiftInfo.name
                                }</b> (ID:${data.giftId})<span><br>
                                <span>Repeat: <b style="${
                                  isPendingStreak(data) ? "color:red" : ""
                                }">x${data.gift.repeat_count.toLocaleString()}</b><span><br>
                                <span>Cost: <b>${(
                                  data.extendedGiftInfo.diamond_count *
                                  data.gift.repeat_count
                                ).toLocaleString()} Diamonds</b><span>
                            </td>
                        </tr>
                    </tabl>
                </div>
            </span>
        </div>
    `;

  let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

  if (existingStreakItem.length) {
    existingStreakItem.replaceWith(html);
  } else {
    container.append(html);
  }

  container.stop();
  container.animate(
    {
      scrollTop: container[0].scrollHeight,
    },
    800
  );
}

// Control events
ioConnection.on("setUniqueIdSuccess", (state) => {
  // reset stats
  viewerCount = 0;
  likeCount = 0;
  diamondsCount = 0;
  updateRoomStats();
  $("#stateText").text(`Connected to roomId ${state.roomId}`);
});

ioConnection.on("setUniqueIdFailed", (errorMessage) => {
  $("#stateText").text(errorMessage);
});

ioConnection.on("streamEnd", () => {
  $("#stateText").text("Stream ended.");
});

// viewer stats
ioConnection.on("roomUser", (msg) => {
  if (typeof msg.viewerCount === "number") {
    viewerCount = msg.viewerCount;
    updateRoomStats();
  }
});

// like stats
ioConnection.on("like", (msg) => {
  if (typeof msg.likeCount === "number") {
    //addChatItem('#447dd4', msg, msg.label.replace('{0:user}', '').replace('likes', `${msg.likeCount} likes`))
  }

  if (typeof msg.totalLikeCount === "number") {
    likeCount = msg.totalLikeCount;
    updateRoomStats();
  }
});

// Chat events,
let joinMsgDelay = 0;
ioConnection.on("member", (msg) => {
  let addDelay = 250;
  if (joinMsgDelay > 500) addDelay = 100;
  if (joinMsgDelay > 1000) addDelay = 0;

  joinMsgDelay += addDelay;

  setTimeout(() => {
    joinMsgDelay -= addDelay;
    //addChatItem('#21b2c2', msg, 'joined', true);
  }, joinMsgDelay);
});

ioConnection.on("chat", (msg) => {
  //addChatItem("white", msg, msg.comment);
  if (msg.comment === "ticket" || msg.comment === "Ticket") {
    if (!usersBoughtTicket.includes(msg.uniqueId)) {
      passengersCount += 1;
      updateRoomStats();
      addTicketItem("white", msg, "ECONOMY");
      usersBoughtTicket.push(msg.uniqueId);
    }
  }
});

ioConnection.on("gift", (data) => {
  if (
    !usersBoughtBusinessTicket.includes(data.uniqueId) &&
    data.extendedGiftInfo.name === "Rose"
  ) {
    passengersBusinessCount += 1;
    addTicketItem("aqua", data, "BUSINESS");
    usersBoughtBusinessTicket.push(data.uniqueId);
  }

  if (
    !usersBoughtFirstClassTicket.includes(data.uniqueId) &&
    data.extendedGiftInfo.name === "Little Crown"
  ) {
    passengersFirstClassCount += 1;
    addTicketItem("gold", data, "FIRST CLASS");
    usersBoughtFirstClassTicket.push(data.uniqueId);
  }
  //addGiftItem(data);
  /*
  if (!isPendingStreak(data) && data.extendedGiftInfo.diamond_count > 0) {
    diamondsCount +=
      data.extendedGiftInfo.diamond_count * data.gift.repeat_count;
    updateRoomStats();
  }
  */
});

// share, follow
ioConnection.on("social", (data) => {
  let color = data.displayType.includes("share") ? "#ff005e" : "#2fb816";
  //addChatItem(color, data, data.label.replace('{0:user}', ''));
});
