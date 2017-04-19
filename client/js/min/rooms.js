window.ClientMainRoom=function(t){this.app=t,this.id="_home",this.name="Home",this.sendLog=[],this.sendLogPos=0;var s="";s+='<div class="help-home-div" id="help-home-div">',s+=$("#data-div-home-help").html(),s+="</div>",s+='<div class="rooms-home-div" id="rooms-home-div">',s+="</div>",s+='<div class="home-chat-div">',s+='<h2 align="center" class="chat-title">Private Chat Terminal</h2>',s+='<div class="chat-container" id="'+this.id+'-chat-container">',s+='<div class="chat-subcontainer" id="'+this.id+'-chat-subcontainer"></div></div>',s+='<div class="chat-area" id="'+this.id+'-chat-area">',s+='<span class="connecting-chatarea">Connecting...</span>',s+="</div>",s+="</div>",t.addTab("_home",'<span class="ui-icon ui-icon-home"></span> Home',s)},ClientMainRoom.prototype.send=function(t){this.app.send("@\n"+t)},ClientMainRoom.prototype.saveLog=function(t){this.sendLogPos>0&&(this.sendLog.shift(),this.sendLogPos=0),this.sendLog.unshift(t),this.sendLog.length>20&&this.sendLog.pop()},ClientMainRoom.prototype.setNotConnected=function(){var t="";t+='<span class="not-connected-chatarea">You are not connected to the server.</span>',t+='<span class="chatarea-buttons"><button name="reconnect" class="chatarea-button">Reconnect</button></span>',$("#"+this.id+"-chat-area").html(t)},ClientMainRoom.prototype.setLoginStatus=function(t,s){var e="";e+='<textarea class="chat-textarea" rows="1" id="'+this.id+'-chat-textarea" type="text" autocomplete="off" placeholder="Type here and press Enter to send."></textarea>',$("#"+this.id+"-chat-area").html(e),autosize($("#"+this.id+"-chat-textarea")),$("#"+this.id+"-chat-textarea").on("keydown",function(t){if(13==t.which){if(!t.target.value)return;this.send(t.target.value),this.saveLog(t.target.value),t.target.value="",t.preventDefault()}else if(38==t.which)this.sendLogPos<this.sendLog.length-1?(this.sendLogPos++,1===this.sendLogPos&&this.sendLog.unshift(t.target.value),t.target.value=this.sendLog[this.sendLogPos]):1===this.sendLog.length&&0===this.sendLogPos&&(this.sendLogPos=1,this.sendLog.unshift(t.target.value),t.target.value=this.sendLog[this.sendLogPos]),t.preventDefault();else if(40==t.which)this.sendLogPos>0&&(this.sendLogPos--,t.target.value=this.sendLog[this.sendLogPos],0===this.sendLogPos&&this.sendLog.shift()),t.preventDefault();else if(9==t.which){var s=this.app.completeLine(t.target.value,this);t.target.value!==s&&(t.target.value=s),t.preventDefault()}}.bind(this)),"~"===s?(this.name='<span class="ui-icon ui-icon-home"></span> Home - Administrator',this.app.changeTabTitleHTML(this.id,this.name)):(this.name='<span class="ui-icon ui-icon-home"></span> Home',this.app.changeTabTitleHTML(this.id,this.name))},ClientMainRoom.prototype.setRoomsList=function(t){this.room_list=t;var s="";for(var e in t)s+='<div class="room-joiner">',s+='<button id="join-btn-'+e+'" class="join-btn" name="joinroom" value="'+e+'">'+Tools.escapeHTML(t[e].name)+"</button>",s+="</div>";$("#rooms-home-div").html(s)},ClientMainRoom.prototype.add=function(t){var s=$("#"+this.id+"-chat-container"),e=$("#"+this.id+"-chat-subcontainer"),a=s.scrollTop()>=e.height()-s.height()-50;e.append(t),a&&s.scrollTop(e.height())},ClientMainRoom.prototype.addMsg=function(t,s){this.add('<div class="chat-msg"><span class="chat-time">'+Tools.getTimeString(s)+"</span> "+t+"</div>")},ClientMainRoom.prototype.addLine=function(t){this.add('<div class="chat-msg"><div class="chat-line">'+t+"</div></div>")},ClientMainRoom.prototype.addChat=function(t,s,e,a){this.addMsg('<span class="chat-user-group">'+Tools.escapeHTML(s)+'</span><span class="chat-user-name">'+Tools.escapeHTML(t)+'</span><span class="chat-user-separator">: </span><span class="chat-user-msg">'+Tools.parseChatMsg(e)+"</span>",a)},window.AuctionRoom=function(t,s){this.app=t,this.id=s,this.name=s,this.users={},this.auction={},this.status=0,this.nominated="",this.nominatedTeam="",this.nominatedCost=0,this.timeout=0,this.timer=null,this.modchat=0,this.sendLog=[],this.sendLogPos=0,this.selectedPlayers={};var e="";e+='<div id="single-room-tabs-'+this.id+'" class="single-room-tabs">',e+="<ul>",e+='<li><a href="#tab-auction-'+this.id+'">Auction</a></li>',e+='<li><a href="#tab-teams-'+this.id+'">Teams</a></li>',e+='<li><a href="#tab-players-'+this.id+'">Players</a></li>',e+='<li><a href="#tab-users-'+this.id+'">Users</a></li>',e+="</ul>",e+='<div id="tab-auction-'+this.id+'" class="room-tab-option room-auction-status"></div>',e+='<div id="tab-teams-'+this.id+'" class="room-tab-option"></div>',e+='<div id="tab-players-'+this.id+'" class="room-tab-option"></div>',e+='<div id="tab-users-'+this.id+'" class="room-tab-option"></div>',e+="</div>",e+='<div class="room-chat-div">',e+='<h2 align="center" class="chat-title">Public Chat</h2>',e+='<div class="chat-container" id="'+this.id+'-chat-container">',e+='<div class="chat-subcontainer" id="'+this.id+'-chat-subcontainer"></div></div>',e+='<div class="chat-area" id="'+this.id+'-chat-area">',e+='<span class="not-connected-chatarea">You are not connected to the server.</span>',e+="</div>",e+="</div>",t.addTab(this.id,this.id,e),this.tabs=$("#single-room-tabs-"+this.id).tabs(),this.tabs.tabs("disable",4),$("#room-close-button-"+this.id).on("click",function(){this.app.home_room.send("/leave "+this.id)}.bind(this))},AuctionRoom.prototype.setRoomName=function(t){this.name=t,this.app.changeTabTitle(this.id,this.name)},AuctionRoom.prototype.send=function(t){this.app.send(this.id+"\n"+t)},AuctionRoom.prototype.saveLog=function(t){this.sendLogPos>0&&(this.sendLog.shift(),this.sendLogPos=0),this.sendLog.unshift(t),this.sendLog.length>20&&this.sendLog.pop()},AuctionRoom.prototype.setNotConnected=function(){var t="";t+='<span class="not-connected-chatarea">You are not connected to the server.</span>',t+='<span class="chatarea-buttons"><button name="reconnect" class="chatarea-button">Reconnect</button></span>',$("#"+this.id+"-chat-area").html(t)},AuctionRoom.prototype.setLoginStatus=function(t){var s="";s+='<textarea class="chat-textarea" rows="1" id="'+this.id+'-chat-textarea" type="text" size="70" autocomplete="off" placeholder="Type here and press Enter to send."></textarea>',$("#"+this.id+"-chat-area").html(s),autosize($("#"+this.id+"-chat-textarea")),$("#"+this.id+"-chat-textarea").on("keydown",function(t){if(13==t.which){if(!t.target.value)return;this.send(t.target.value),this.saveLog(t.target.value),t.target.value="",t.preventDefault()}else if(38==t.which)this.sendLogPos<this.sendLog.length-1?(this.sendLogPos++,1===this.sendLogPos&&this.sendLog.unshift(t.target.value),t.target.value=this.sendLog[this.sendLogPos]):1===this.sendLog.length&&0===this.sendLogPos&&(this.sendLogPos=1,this.sendLog.unshift(t.target.value),t.target.value=this.sendLog[this.sendLogPos]),t.preventDefault();else if(40==t.which)this.sendLogPos>0&&(this.sendLogPos--,t.target.value=this.sendLog[this.sendLogPos],0===this.sendLogPos&&this.sendLog.shift()),t.preventDefault();else if(9==t.which){var s=this.app.completeLine(t.target.value,this);t.target.value!==s&&(t.target.value=s),t.preventDefault()}}.bind(this))},AuctionRoom.prototype.add=function(t){var s=$("#"+this.id+"-chat-container"),e=$("#"+this.id+"-chat-subcontainer"),a=s.scrollTop()>=e.height()-s.height()-50;e.append(t),a&&s.scrollTop(e.height())},AuctionRoom.prototype.addMsg=function(t,s){this.add('<div class="chat-msg"><span class="chat-time">'+Tools.getTimeString(s)+"</span> "+t+"</div>")},AuctionRoom.prototype.addLine=function(t){this.add('<div class="chat-msg"><div class="chat-line">'+t+"</div></div>")},AuctionRoom.prototype.addChat=function(t,s,e,a){this.addMsg('<span class="chat-user-group">'+Tools.escapeHTML(s)+'</span><span class="chat-user-name">'+Tools.escapeHTML(t)+'</span><span class="chat-user-separator">: </span><span class="chat-user-msg">'+Tools.parseChatMsg(e)+"</span>",a)},AuctionRoom.prototype.userName=function(t){return t=Tools.toId(t),this.users[t]?this.users[t].name:t},AuctionRoom.prototype.updateAuctionTab=function(){var t,s="";switch(this.timer&&(clearInterval(this.timer),this.timer=null),this.status){case 0:t=this.auction.teams[this.auction.turn],t?(s+="<h3>"+Tools.escapeHTML(t.name)+" has the turn for nominating</h3>",t.captains[this.app.currUser.id]&&(this.getFreePlayers().length>0?(s+='<p><button class="auction-button" name="nominate" value="'+this.id+'">Nominate a Player</button></p>',this.getPlayersByTeam(this.auction.turn).length>=this.auction.config.minplayers&&(s+='<p><button class="auction-button" name="pass" value="'+this.id+'">Pass the turn</button></p>')):s+="<p><b>There are no more players to nominate.</b></p>")):s+="<h3>Waiting for a room manager to set the initial turn</h3>";break;case 1:s+="<h3>"+Tools.escapeHTML(this.playerName(this.nominated))+" has been nominated</h3>",s+="<h4>"+Tools.escapeHTML(this.teamName(this.nominatedTeam))+" has the highest bid: "+Tools.escapeHTML(this.nominatedCost)+"K</h4>",t=this.getTeamByCaptain(this.app.currUser.id),t&&(s+='<p><button class="auction-button" name="bid" value="'+this.id+'"'+(t.id===this.nominatedTeam?"disabled":"")+">Offer "+Tools.escapeHTML(this.nominatedCost+.5)+"K</button></p>",s+="<p>Use <b>/bid X</b> to offer a custom amount.</p>"),s+='<p class="timer-msg"><span class="timer-mark" id="'+this.id+'-timer-mark">99 seconds left</span>.</p>',this.timer=setInterval(function(){var t=Math.floor((this.timeout-(Date.now()-this.app.timeoffset))/1e3);t<=0?$("#"+this.id+"-timer-mark").html("Waiting..."):$("#"+this.id+"-timer-mark").html(t+" second"+(1===t?"":"s")+" left")}.bind(this),1e3);break;default:s+="<p>Waiting...</p>"}if(this.users[this.app.currUser.id]&&this.users[this.app.currUser.id].group in{"#":1,"~":1}&&(s+="<hr />",s+='<div class="auction-configuration-controls">',s+='<button class="config-button" name="changeconfig" value="'+this.id+'"'+(0===this.status?"":" disabled")+">Change Auction Configuration</button>",s+="</div>"),$("#tab-auction-"+this.id).html(s),1===this.status){var e=Math.floor((this.timeout-(Date.now()-this.app.timeoffset))/1e3);e<=0?$("#"+this.id+"-timer-mark").html("Waiting..."):$("#"+this.id+"-timer-mark").html(e+" second"+(1===e?"":"s")+" left")}},AuctionRoom.prototype.updateUsersTab=function(){var t=0,s={admin:{sym:"~",u:[],n:"Administrator"},manager:{sym:"#",u:[],n:"Room Manager"},mod:{sym:"@",u:[],n:"Moderator"},participant:{sym:"%",u:[],n:"Auction Participant"},user:{sym:"+",u:[],n:"Regular User"}};for(var e in this.users){t++;for(var a in s)s[a].sym===this.users[e].group&&s[a].u.push(Tools.escapeHTML(this.users[e].name))}var i='<h2 align="center">Online Users ('+t+")</h2>";i+='<table border="0" class="users-table">',i+='<tr class="table-title"><td>&nbsp;</td><td><b>User Name</b></td><td><b>Group Name</b></td></tr>';for(var a in s)if(0!==s[a].u.length)for(var o=s[a].u.sort(),n=0;n<o.length;n++)i+="<tr>",i+='<td align="center"><b>'+Tools.escapeHTML(s[a].sym)+"</b></td>",i+="<td>"+o[n]+"</td>",i+="<td>"+s[a].n+"</td>",i+="</tr>";i+="</table>",$("#tab-users-"+this.id).html(i)},AuctionRoom.prototype.updatePlayersTab=function(){var t="",s=this.getPlayers();this.users[this.app.currUser.id]&&this.users[this.app.currUser.id].group in{"#":1,"~":1}&&(t+='<div class="auction-players-control">',t+='<button class="config-button" name="rmplayers" value="'+this.id+'">Remove Selected Players</button><button class="config-button" name="addplayers" value="'+this.id+'">Add Players</button>',t+="</div>",t+="<hr />"),t+='<table border="0" class="players-table">',t+='<tr class="table-title"><td>&nbsp;</td><td><b>Player</b></td><td><b>Team</b></td><td><b>Cost</b></td></tr>';for(var e=0;e<s.length;e++){var a=Tools.toPlayerId(s[e]);t+="<tr>",t+='<td><input type="checkbox" name="select-player-checkbox" value="'+this.id+"|"+a+'" '+(this.selectedPlayers[a]?'checked="checked" ':"")+"/></td>",t+="<td>"+Tools.escapeHTML(this.playerName(a))+"</td>",this.auction.players[a].team?(t+="<td>"+Tools.escapeHTML(this.teamName(this.auction.players[a].team))+"</td>",t+="<td>"+Tools.escapeHTML(this.auction.players[a].cost)+"K</td>"):(t+="<td> - </td>",t+="<td> - </td>"),t+="</tr>"}t+="</table>",$("#tab-players-"+this.id).html(t)},AuctionRoom.prototype.updateTeamsTab=function(){var t,s,e='<h2 align="center">Auction Teams</h2>';this.users[this.app.currUser.id]&&this.users[this.app.currUser.id].group in{"#":1,"~":1}&&(e+='<div class="auction-teams-control">',e+='<button class="config-button" name="addteam" value="'+this.id+'">Register New Team</button>',e+="</div>");for(var a in this.auction.teams){t=this.getPlayersByTeam(a),s=[];for(var i in this.auction.teams[a].captains)s.push(i);e+='<div class="team-widget">',e+="<h3>"+this.auction.teams[a].name+"</h3>",e+="<h4>Money: "+this.auction.teams[a].money+"K</h4>",e+="<hr />",e+="<h4>Captains</h4>",e+="<p>"+(Tools.escapeHTML(s.join(", "))||"<i>(none)</i>")+"</p>",e+="<hr />",e+="<h4>Players ("+t.length+")</h4>",e+="<p>"+(Tools.escapeHTML(t.join(", "))||"<i>(none)</i>")+"</p>",this.users[this.app.currUser.id]&&this.users[this.app.currUser.id].group in{"#":1,"~":1}&&(e+="<hr />",e+='<div class="auction-teams-control">',e+='<button class="config-button" name="setturn" value="'+this.id+"|"+a+'"'+(this.auction.turn===a?" disabled":"")+">Give Turn</button>",e+='<button class="config-button" name="assignplayer" value="'+this.id+"|"+a+'"'+(0===this.getFreePlayers().length?" disabled":"")+">Add Player</button>",e+='<button class="config-button" name="setfreeplayer" value="'+this.id+"|"+a+'"'+(0===this.getPlayersByTeam(a).length?" disabled":"")+">Remove Player</button>",e+='<button class="config-button" name="setcaptain" value="'+this.id+"|"+a+'">Add Captain</button>',e+='<button class="config-button" name="rmcaptain" value="'+this.id+"|"+a+'"'+(0===this.getCaptainsByTeam(a).length?" disabled":"")+">Remove Captain</button>",e+='<button class="config-button" name="setmoney" value="'+this.id+"|"+a+'">Set Money</button>',e+='<button class="config-button-danger" name="deleteteam" value="'+this.id+"|"+a+'">Delete Team</button>',e+="</div>"),e+="</div>"}$("#tab-teams-"+this.id).html(e)};