function Client(e){this.maindiv=e,this.socket=null,this.connected=!1,this.timeoffset=0,this.currUser={id:"",name:"",guest:!0,group:" "},this.maindiv.append('<div id="main-tabs"><ul id="main-tabs-ul"></ul></div>'),this.maintabs=$("#main-tabs").tabs(),this.maintabs.find(".ui-tabs-nav").sortable({axis:"x",stop:function(){this.maintabs.tabs("refresh")}.bind(this)}),this.maintabs.on("click","span.ui-icon-close",function(e){var o=$(e.target).closest("li").attr("aria-controls");this.removeTab(o)}.bind(this)),this.maindiv.append('<div id="alert-msg" title="Alert Message"><p id="alert-msg-txt"></p></div>'),this.alertsdialog=$("#alert-msg").dialog({autoOpen:!1,resizable:!1,height:"auto",width:500,modal:!1,buttons:{Ok:function(){this.alertsdialog.dialog("close")}.bind(this)}}),this.maindiv.append('<div id="login-dialog" title="Login"><form><p><span class="field-name">Username: </span><input type="text" name="user" id="login-dialog-user" value="" class="login-text-field"></p><p><span class="field-name">Password: </span><input type="password" name="pass" id="login-dialog-pass" value="" class="pass-text-field"></p></form><p><span class="dialog-error-msg" id="login-dialog-error-msg"></span></p></div>'),this.logindialog=$("#login-dialog").dialog({autoOpen:!1,resizable:!1,height:"auto",width:"auto",modal:!1,buttons:{Login:{text:"Login",id:"login-dialog-button",click:function(){var e=this.logindialog.checkLoginFunc();e?$("#login-dialog-error-msg").html(e):(this.logindialog.dialog("close"),this.home_room.send("/login "+$("#login-dialog-user").prop("value")+","+$("#login-dialog-pass").prop("value")),$("#login-dialog-pass").prop("value",""))}.bind(this)}}}),this.logindialog.checkLoginFunc=function(){var e=$("#login-dialog-user").prop("value")||"";return 0===e.length||e.length>25||0===Tools.toId(e).length||Tools.toId(e).length>20||/[\|,]+/g.test(e)?"Invalid nickname.":(e=$("#login-dialog-pass").prop("value")||"",0===e.length?"You must specify a password.":"")},this.maindiv.append('<div id="rename-dialog" title="Rename"><form><p><span class="field-name">Username: </span><input type="text" name="user" id="rename-dialog-user" value="" class="login-text-field"></p></form><p><span class="dialog-error-msg" id="rename-dialog-error-msg"></span></p></div>'),this.renamedialog=$("#rename-dialog").dialog({autoOpen:!1,resizable:!1,height:"auto",width:400,modal:!1,buttons:{Rename:{text:"Rename",id:"rename-dialog-button",click:function(){var e=$("#rename-dialog-user").prop("value")||"";0===e.length||e.length>25||/[\|,]+/g.test(e)?$("#rename-dialog-error-msg").html("Invalid nickname."):Tools.toId(e)!==Tools.toId(this.currUser.name)?$("#rename-dialog-error-msg").html("Use the login option in order to login into another account."):(this.renamedialog.dialog("close"),this.home_room.send("/rename "+e))}.bind(this)}}}),this.maindiv.append('<div id="register-dialog" title="Register Account"><form><p><span class="field-name">Username: </span><input type="text" name="user" id="register-dialog-user" value="" class="login-text-field"></p><p><span class="field-name">Password: </span><input type="password" name="pass" id="register-dialog-pass" value="" class="pass-text-field"></p><p><span class="field-name">Password (again): </span><input type="password" name="pass" id="register-dialog-pass2" value="" class="pass-text-field"></p></form><p><span class="dialog-error-msg" id="register-dialog-error-msg"></span></p></div>'),this.registerdialog=$("#register-dialog").dialog({autoOpen:!1,resizable:!1,height:"auto",width:400,modal:!1,buttons:{Register:{text:"Register",id:"register-dialog-button",click:function(){var e=this.registerdialog.checkRegisterFunc();e?$("#register-dialog-error-msg").html(e):(this.registerdialog.dialog("close"),this.home_room.send("/register "+$("#register-dialog-user").prop("value")+","+$("#register-dialog-pass").prop("value")),$("#register-dialog-pass").prop("value",""),$("#register-dialog-pass2").prop("value",""))}.bind(this)}}}),this.registerdialog.checkRegisterFunc=function(){var e=$("#register-dialog-user").prop("value")||"";return 0===e.length||e.length>25||0===Tools.toId(e).length||Tools.toId(e).length>20||/[\|,]+/g.test(e)?"Invalid nickname.":(e=$("#register-dialog-pass").prop("value")||"",0===e.length?"You must specify a password.":e!==$("#register-dialog-pass2").prop("value")?"The passwords do not match.":"")},this.maindiv.append('<div id="cpassword-dialog" title="Change Password"><form><p><span class="field-name">Password: </span><input type="password" name="pass" id="cpassword-dialog-pass" value="" class="pass-text-field"></p><p><span class="field-name">New Password: </span><input type="password" name="pass" id="cpassword-dialog-newpass" value="" class="pass-text-field"></p><p><span class="field-name">New Password (again): </span><input type="password" name="pass" id="cpassword-dialog-newpass2" value="" class="pass-text-field"></p></form><p><span class="dialog-error-msg" id="cpassword-dialog-error-msg"></span></p></div>'),this.cpassworddialog=$("#cpassword-dialog").dialog({autoOpen:!1,resizable:!1,height:"auto",width:450,modal:!1,buttons:{ChangePassword:{text:"Change Password",id:"cpassword-dialog-button",click:function(){var e=this.cpassworddialog.checkPasswordFunc();if(e)$("#cpassword-dialog-error-msg").html(e);else{this.cpassworddialog.dialog("close");var o={pass:$("#cpassword-dialog-pass").prop("value"),newpass:$("#cpassword-dialog-newpass").prop("value")};this.home_room.send("/changepassword "+JSON.stringify(o)),$("#cpassword-dialog-pass").prop("value",""),$("#cpassword-dialog-newpass").prop("value",""),$("#cpassword-dialog-newpass2").prop("value","")}}.bind(this)}}}),this.cpassworddialog.checkPasswordFunc=function(){var e=$("#cpassword-dialog-pass").prop("value")||"",o=$("#cpassword-dialog-newpass").prop("value")||"",s=$("#cpassword-dialog-newpass2").prop("value")||"";return 0===e.length||0===o.length?"You must specify both passwords.":o!==s?"The passwords do not match.":""},this.dialogType=null,this.dialogSelectedRoom="",this.activeDialog=!1,this.dialogCallback=null,this.maindiv.append('<div id="dyn-room-dialog" title="Players Auction"><div id="dyn-room-dialog-content"></div></div>'),this.dynamicDialog=$("#dyn-room-dialog").dialog({autoOpen:!1,resizable:!1,height:"auto",width:"auto",modal:!0,buttons:{Apply:{text:"Apply",id:"apply-room-dialog-button",click:function(){"function"==typeof this.dialogCallback?this.dialogCallback(this.dialogSelectedRoom)&&this.dynamicDialog.dialog("close"):this.dynamicDialog.dialog("close")}.bind(this)},Cancel:{text:"Cancel",id:"cancel-room-dialog-button",click:function(){this.dynamicDialog.dialog("close")}.bind(this)}}}),$("#register-button").prop("disabled",!0),$("#rename-button").prop("disabled",!0),$("#login-button").prop("disabled",!0),$("#cpassword-button").prop("disabled",!0),this.rooms={},this.home_room=new ClientMainRoom(this),this.maintabs.tabs("option","active",0),this.menuDisplayed=!1,$(document).on("click","button",function(e){var o;switch(e.target.name){case"reconnect":document.location.reload();break;case"joinroom":this.rooms[$(e.target).prop("value")]?this.maintabs.tabs("option","active",$('#tabs a[href="#'+$(e.target).prop("value")+'"]').parent().index()):this.home_room.send("/join "+$(e.target).prop("value"));break;case"login":this.logindialog.dialog("open"),$("#login-dialog-error-msg").html("");break;case"rename":this.renamedialog.dialog("open"),$("#rename-dialog-error-msg").html(""),$("#rename-dialog-user").prop("value",this.currUser.name);break;case"register":this.registerdialog.dialog("open"),$("#register-dialog-error-msg").html("");break;case"cpassword":this.cpassworddialog.dialog("open"),$("#cpassword-dialog-error-msg").html("");break;case"menu":this.menuDisplayed?($("#options-menu").css({display:"none"}),this.menuDisplayed=!1):($("#options-menu").css({display:"inherit"}),this.menuDisplayed=!0);break;case"changeconfig":o=$(e.target).prop("value"),this.showRoomDialog(o,"Configuration - "+Tools.escapeHTML(this.rooms[o]?this.rooms[o].name:o),this.getDialog(o,"CONFIG"),function(e){return this.applyDialog(e,"CONFIG")}.bind(this));break;case"addteam":o=$(e.target).prop("value"),this.showRoomDialog(o,"Add new team - "+Tools.escapeHTML(this.rooms[o]?this.rooms[o].name:o),this.getDialog(o,"NEW-TEAM"),function(e){return this.applyDialog(e,"NEW-TEAM")}.bind(this));break;case"deleteteam":o=$(e.target).prop("value").split("|"),this.showRoomDialog(o[0],'Delete Team "'+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].teamName(o[1]):o[1])+'"? - '+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].name:o[0]),this.getDialog(o[0],"DELETE-TEAM"),function(e){return this.applyDialog(e,"DELETE-TEAM",{team:o[1]})}.bind(this));break;case"addplayers":o=$(e.target).prop("value"),this.showRoomDialog(o,"Add Players - "+Tools.escapeHTML(this.rooms[o]?this.rooms[o].name:o),this.getDialog(o,"ADD-PLAYERS"),function(e){return this.applyDialog(e,"ADD-PLAYERS")}.bind(this));break;case"rmplayers":if(o=$(e.target).prop("value"),this.rooms[o]&&0===this.rooms[o].getSelectedPlayers().length)break;this.showRoomDialog(o,"Delete Players - "+Tools.escapeHTML(this.rooms[o]?this.rooms[o].name:o),this.getDialog(o,"DELETE-PLAYERS"),function(e){return this.applyDialog(e,"DELETE-PLAYERS")}.bind(this));break;case"setturn":o=$(e.target).prop("value").split("|"),this.rooms[o[0]]&&this.rooms[o[0]].send("/turn "+o[1]);break;case"assignplayer":o=$(e.target).prop("value").split("|"),this.showRoomDialog(o[0],'Assign player to team "'+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].teamName(o[1]):o[1])+'" - '+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].name:o[0]),this.getDialog(o[0],"ASSIGN-PLAYER",{team:o[1]}),function(e){return this.applyDialog(e,"ASSIGN-PLAYER",{team:o[1]})}.bind(this));break;case"setfreeplayer":o=$(e.target).prop("value").split("|"),this.showRoomDialog(o[0],'Release player of team "'+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].teamName(o[1]):o[1])+'" - '+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].name:o[0]),this.getDialog(o[0],"FREE-PLAYER",{team:o[1]}),function(e){return this.applyDialog(e,"FREE-PLAYER",{team:o[1]})}.bind(this));break;case"setcaptain":o=$(e.target).prop("value").split("|"),this.showRoomDialog(o[0],'Add captain for team "'+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].teamName(o[1]):o[1])+'" - '+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].name:o[0]),this.getDialog(o[0],"ADD-CAPTAIN",{team:o[1]}),function(e){return this.applyDialog(e,"ADD-CAPTAIN",{team:o[1]})}.bind(this));break;case"rmcaptain":o=$(e.target).prop("value").split("|"),this.showRoomDialog(o[0],'Delete captain of team "'+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].teamName(o[1]):o[1])+'" - '+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].name:o[0]),this.getDialog(o[0],"DELETE-CAPTAIN",{team:o[1]}),function(e){return this.applyDialog(e,"DELETE-CAPTAIN",{team:o[1]})}.bind(this));break;case"setmoney":o=$(e.target).prop("value").split("|"),this.showRoomDialog(o[0],'Set money of team "'+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].teamName(o[1]):o[1])+'" - '+Tools.escapeHTML(this.rooms[o[0]]?this.rooms[o[0]].name:o[0]),this.getDialog(o[0],"SET-MONEY",{team:o[1]}),function(e){return this.applyDialog(e,"SET-MONEY",{team:o[1]})}.bind(this));break;case"nominate":o=$(e.target).prop("value"),this.showRoomDialog(o,"Nominate - "+Tools.escapeHTML(this.rooms[o]?this.rooms[o].name:o),this.getDialog(o,"NOMINATE"),function(e){return this.applyDialog(e,"NOMINATE")}.bind(this));break;case"bid":o=$(e.target).prop("value"),this.rooms[o]&&this.rooms[o].send("/bid "+(this.rooms[o].nominatedCost+.5));break;case"pass":o=$(e.target).prop("value"),this.rooms[o]&&this.rooms[o].send("/pass")}e.preventDefault()}.bind(this)),$(document).on("click",function(e){"menu"!==e.target.name&&($("#options-menu").css({display:"none"}),this.menuDisplayed=!1)}.bind(this)),$(document).on("click","input",function(e){if("select-player-checkbox"===e.target.name){var o=$(e.target).prop("value").split("|");this.rooms[o[0]]&&(this.rooms[o[0]].selectedPlayers[o[1]]=!0,this.rooms[o[0]].checkSelectedPlayers())}}.bind(this))}Client.prototype.connect=function(){"file:"===document.location.protocol?this.socket=new SockJS("http://localhost:8080/auction"):(console.log("DEBUG: Protocol = "+document.location.protocol),this.socket=new SockJS("/auction")),this.socket.onclose=function(){console.log("Connection closed!"),this.connected=!1,this.onClose()}.bind(this),this.socket.onopen=function(){console.log("Connected to the server!"),this.connected=!0,$("#connect-msg-txt").html("Connected to the server, waiting for syn message...")}.bind(this),this.socket.onmessage=function(e){"string"==typeof e.data?(console.log("<<< "+e.data),this.parseMessage(e.data)):console.log("Message dropped: "+JSON.stringify(e.data))}.bind(this)},Client.prototype.send=function(e){this.connected?this.socket.send(e):console.log("Could not send: "+e)},Client.prototype.showAlert=function(e,o){$("#alert-msg-txt").html(o),this.alertsdialog.dialog("option","title",e),this.alertsdialog.dialog("open")},Client.prototype.onOpen=function(){$("#login-status").html("Connected"),$("#login-status").css({color:"green"}),$("#register-button").prop("disabled",!1),$("#rename-button").prop("disabled",!1),$("#login-button").prop("disabled",!1)},Client.prototype.onClose=function(){$("#login-status").html("Not-Connected"),$("#login-status").css({color:"red"}),$("#register-button").prop("disabled",!0),$("#rename-button").prop("disabled",!0),$("#login-button").prop("disabled",!0),$("#cpassword-button").prop("disabled",!0),this.home_room.setNotConnected();for(var e in this.rooms)this.rooms[e].setNotConnected()},Client.prototype.parseMessage=function(e){var o,s=e.split("\n");if(":"===s[0].charAt(0)){var a=1e3*parseInt(s[0].substr(1));this.timeoffset=Date.now()-a,this.onOpen()}else"!"===s[0].charAt(0)?this.showAlert("Warning","<span>The server rejected the connection. It is possible your public IP address was banned.</span>"):"@"===s[0]?o=this.home_room:(o=this.rooms[Tools.toRoomId(s[0])],o||(o=new AuctionRoom(this,Tools.toRoomId(s[0])),o.setLoginStatus(this.currUser.name),this.rooms[Tools.toRoomId(s[0])]=o));for(var t={client:this},i=1;i<s.length;i++)this.parseCommand(o,s[i],t)},Client.prototype.parseCommand=function(e,o,s){o=o.split("|");var a=o[0];ServerCommandsHandlers[a]?ServerCommandsHandlers[a](e,a,o,s):e.addLine(Tools.escapeHTML(o.join("|")))},Client.prototype.changeLogin=function(e,o,s){if(void 0!==e){var a=Tools.getCookie("token"),t=document.location.href.split("#")[1];(this.currUser.id||"_home"===t)&&(t=""),a&&!this.currUser.id&&this.home_room.send("/token "+a),t&&this.home_room.send("/join "+t),this.currUser.name=e,this.currUser.id=Tools.toId(e)}void 0!==o&&(this.currUser.guest=o),void 0!==s&&(this.currUser.group=s),$("#login-status").html(Tools.escapeHTML(e)),$("#login-status").css({color:"white"}),o?$("#cpassword-button").prop("disabled",!0):$("#cpassword-button").prop("disabled",!1),this.home_room.setLoginStatus(e,s);for(var i in this.rooms)this.rooms[i].setLoginStatus(e)},Client.prototype.addTab=function(e,o,s){var a="_home"!==e?"<span id='room-close-button-"+e+"' class='ui-icon ui-icon-close' role='presentation'>Close Room</span>":"",t="<li id='tab-"+e+"'><a href='#{href}'>#{label}</a> "+a+"</li>",i=$(t.replace(/#\{href\}/g,"#"+e).replace(/#\{label\}/g,o));$("#main-tabs-ul").append(i),this.maintabs.append("<div class='room-div' id='"+e+"'><p>"+s+"</p></div>"),this.maintabs.tabs("refresh")},Client.prototype.changeTabTitle=function(e,o){$("#tab-"+e).find(".ui-tabs-anchor").html(Tools.escapeHTML(o)),this.maintabs.tabs("refresh")},Client.prototype.changeTabTitleHTML=function(e,o){$("#tab-"+e).find(".ui-tabs-anchor").html(o),this.maintabs.tabs("refresh")},Client.prototype.removeTab=function(e){$("#tab-"+e).remove(),$("#"+e).remove(),this.maintabs.tabs("refresh")},Client.prototype.showRoomDialog=function(e,o,s,a){this.dialogType=o,this.dialogSelectedRoom=e,this.dialogCallback=a,$("#dyn-room-dialog-content").html(s),this.activeDialog=!0,this.dynamicDialog.dialog("option","title",this.dialogType),this.dynamicDialog.dialog("open")},Client.prototype.getDialog=function(e,o,s){var a,t="";if(e=this.rooms[e]){switch(o){case"CONFIG":t+="<form>",t+='<p><span class="field-name">Bid Duration (seconds): </span><input type="text" id="dyn-dialog-timer" value="'+e.auction.config.timer+'" class="text-field"></p>',t+='<p><span class="field-name">Min players for completing teams: </span><input type="text" id="dyn-dialog-minplayers" value="'+e.auction.config.minplayers+'" class="text-field"></p>',t+='<p><span class="field-name">Nomination Cost (K): </span><input type="text" id="dyn-dialog-mincost" value="'+e.auction.config.mincost+'" class="text-field"></p>',t+='<p><span class="dialog-error-msg" id="dyn-dialog-error-msg"></span></p>',t+="</form>";break;case"NEW-TEAM":t+="<form>",t+='<p><span class="field-name">Team Name: </span><input type="text" id="dyn-dialog-name" value="" class="text-field"></p>',t+='<p><span class="field-name">Money (K): </span><input type="text" id="dyn-dialog-money" value="100" class="text-field"></p>',t+='<p><span class="dialog-error-msg" id="dyn-dialog-error-msg"></span></p>',t+="</form>";break;case"DELETE-TEAM":t+='<p><span class="dialog-danger-msg">Warning: This action is not reversible.</span></p>';break;case"ASSIGN-PLAYER":t+="<form>",t+='<p><span class="field-name">Player: </span><select class="config-select" id="dyn-dialog-player">',a=e.getFreePlayers();for(var i=1;i<a.length;i++)t+='<option value="'+Tools.toPlayerId(a[i])+'">'+Tools.escapeHTML(a[i])+"</option>";t+="</select></p>",t+='<p><span class="field-name">Money (K): </span><input type="text" id="dyn-dialog-money" value="3" class="text-field"></p>',t+='<p><span class="dialog-error-msg" id="dyn-dialog-error-msg"></span></p>',t+="</form>";break;case"FREE-PLAYER":t+="<form>",t+='<p><span class="field-name">Player: </span><select class="config-select" id="dyn-dialog-player">',a=e.getPlayersByTeam(s.team);for(var i=1;i<a.length;i++)t+='<option value="'+Tools.toPlayerId(a[i])+'">'+Tools.escapeHTML(a[i])+"</option>";t+="</select></p>",t+="</form>";break;case"ADD-CAPTAIN":t+="<form>",t+='<p><span class="field-name">Captain Name: </span><input type="text" id="dyn-dialog-captain" value="" class="text-field"></p>',t+="</form>";break;case"DELETE-CAPTAIN":t+="<form>",t+='<p><span class="field-name">Captain: </span><select class="config-select" id="dyn-dialog-captain">',s.captains=e.getCaptainsByTeam(s.team);for(var n=0;n<s.captains.length;n++)t+='<option value="'+Tools.toId(s.captains[n])+'">'+Tools.escapeHTML(s.captains[n])+"</option>";t+="</select></p>",t+="</form>";break;case"SET-MONEY":t+="<form>",e.auction.teams[s.team]?s.money=e.auction.teams[s.team].money:s.money=0,t+='<p><span class="field-name">Money (K): </span><input type="text" id="dyn-dialog-money" value="'+s.money+'" class="text-field"></p>',t+='<p><span class="dialog-error-msg" id="dyn-dialog-error-msg"></span></p>',t+="</form>";break;case"ADD-PLAYERS":t+="<form>",t+='<p><textarea class="config-textarea" id="dyn-dialog-players" placeholder="Player1, Player2, Player3, ..."></textarea></p>',t+="</form>";break;case"DELETE-PLAYERS":t+='<p><span class="dialog-danger-msg">Warning: This action is not reversible.</span></p>',t+="<p>Selected Players: "+Tools.escapeHTML(e.getSelectedPlayers().join(", "))+"</p>";break;case"NOMINATE":t+="<form>",t+='<p><span class="field-name">Player: </span><select class="config-select" id="dyn-dialog-player">',a=e.getFreePlayers();for(var i=1;i<a.length;i++)t+='<option value="'+Tools.toPlayerId(a[i])+'">'+Tools.escapeHTML(a[i])+"</option>";t+="</select></p>",t+="</form>"}return t}},Client.prototype.applyDialog=function(e,o,s){if(e=this.rooms[e]){var a={};switch(o){case"CONFIG":return a.timer=parseInt($("#dyn-dialog-timer").prop("value")),a.minplayers=parseInt($("#dyn-dialog-minplayers").prop("value")),a.mincost=parseFloat($("#dyn-dialog-mincost").prop("value")),isNaN(a.timer)||isNaN(a.mincost)||isNaN(a.minplayers)?($("#dyn-dialog-error-msg").html("Invalid configuration. Make sure you type numbers."),!1):a.timer<5?($("#dyn-dialog-error-msg").html("The bid time cannot be lesser than 5 seconds."),!1):a.minplayers<0?($("#dyn-dialog-error-msg").html("A players number cannot be lesser than 0."),!1):a.mincost<=0?($("#dyn-dialog-error-msg").html("Nominations cost must be higher than 0."),!1):10*a.mincost%5!==0?($("#dyn-dialog-error-msg").html("Invalid nomination cost. Use multiples of 0.5K."),!1):(e.send("/config "+a.timer+","+a.mincost+","+a.minplayers),!0);case"NEW-TEAM":return a.name=$("#dyn-dialog-name").prop("value").trim(),a.id=Tools.toTeamId(a.name),a.money=parseFloat($("#dyn-dialog-money").prop("value")),a.id&&a.name?a.name.length>50?($("#dyn-dialog-error-msg").html("Team name is too long."),!1):/[,]+/g.test(a.name)?($("#dyn-dialog-error-msg").html("Team name cannot contain commas."),!1):e.auction.teams[a.id]?($("#dyn-dialog-error-msg").html("The team name is already registered."),!1):isNaN(a.money)||a.money<0?($("#dyn-dialog-error-msg").html("Money must be a positive number."),!1):10*a.money%5!==0?($("#dyn-dialog-error-msg").html("Invalid nomination cost. Use multiples of 0.5K."),!1):(e.send("/addteam "+a.name+","+a.money),!0):($("#dyn-dialog-error-msg").html("Invalid team name."),!1);case"DELETE-TEAM":return e.send("/rmteam "+s.team),!0;case"ASSIGN-PLAYER":return a.player=$("#dyn-dialog-player").prop("value"),a.team=s.team,a.money=parseFloat($("#dyn-dialog-money").prop("value")),isNaN(a.money)||a.money<0?($("#dyn-dialog-error-msg").html("Money must be a positive number."),!1):10*a.money%5!==0?($("#dyn-dialog-error-msg").html("Invalid nomination cost. Use multiples of 0.5K."),!1):(a.err=e.canPaid(a.team,a.money),a.err?($("#dyn-dialog-error-msg").html(a.err),!1):(e.send("/assign "+a.team+","+a.player+","+a.money),!0));case"FREE-PLAYER":return e.send("/free "+$("#dyn-dialog-player").prop("value")),!0;case"ADD-CAPTAIN":return a.captain=Tools.toId($("#dyn-dialog-captain").prop("value")),a.team=s.team,e.send("/setcaptain "+a.team+","+a.captain),!0;case"DELETE-CAPTAIN":return a.captain=Tools.toId($("#dyn-dialog-captain").prop("value")),e.send("/unsetcaptain "+a.captain),!0;case"SET-MONEY":return a.team=s.team,a.money=parseFloat($("#dyn-dialog-money").prop("value")),isNaN(a.money)||a.money<0?($("#dyn-dialog-error-msg").html("Money must be a positive number."),!1):10*a.money%5!==0?($("#dyn-dialog-error-msg").html("Invalid nomination cost. Use multiples of 0.5K."),!1):(e.send("/setmoney "+a.team+","+a.money),!0);case"ADD-PLAYERS":if(a.players=$("#dyn-dialog-players").prop("value"),a.players)return e.send("/addplayers "+a.players),!0;break;case"DELETE-PLAYERS":return a.players=e.getSelectedPlayers().join(", "),a.players&&e.send("/rmplayers "+a.players),!0;case"NOMINATE":return e.send("/nominate "+$("#dyn-dialog-player").prop("value")),!0}return!1}},Client.prototype.completeLine=function(e,o){var s=o.users;if(s||(s={},s[this.currUser.id]=this.currUser),!e)return e;var a="";if("/"===e.charAt(0)){var t=e.indexOf(" ");a=t?e.substr(1,t-1):e.substr(1),console.log("DEBUG: Command used - "+a)}if(e.indexOf(" ")===-1&&"/"===e.charAt(0)){var i=[],n=e.substr(1);for(var r in CommandsUsageData)r.substr(0,n.length)===n&&i.push(r);return 0===i.length?e:1===i.length?"/"+i[0]:(o.addLine(Tools.escapeHTML(i.join(", "))),e)}if(a&&e.indexOf(" ")!==-1&&"<room>"===CommandsUsageData[a]){if(!this.home_room||!this.home_room.room_list)return e;var l=[],p=e.lastIndexOf(" "),d=Tools.toRoomId(e.substr(p));for(var m in this.home_room.room_list)m.substr(0,d.length)===d&&l.push(m);return 0===l.length?e:1===l.length?e.substr(0,p+1)+l[0]:(o.addLine(Tools.escapeHTML(l.join(", "))),e)}if(a&&e.indexOf(" ")!==-1&&"<player>"===CommandsUsageData[a]){if(!o.auction||!o.auction.players)return e;for(var g,c=o.getFreePlayers(),h=[],p=e.lastIndexOf(" "),u=Tools.toPlayerId(e.substr(p)),y=0;y<c.length;y++)g=Tools.toPlayerId(c[y]),g.substr(0,u.length)===u&&h.push(c[y]);return 0===h.length?e:1===h.length?e.substr(0,p+1)+h[0]:(o.addLine(Tools.escapeHTML(h.join(", "))),e)}if(e.indexOf(" ")!==-1){var f=[],p=e.lastIndexOf(" "),b=Tools.toId(e.substr(p));if(""===b)return e;for(var v in s)v.substr(0,b.length)===b&&f.push(s[v].name);return 0===f.length?e:1===f.length?e.substr(0,p+1)+f[0]:(o.addLine(Tools.escapeHTML(f.join(", "))),e)}return e},$(document).ready(function(){window.App=new Client($("#page-content")),App.connect()});