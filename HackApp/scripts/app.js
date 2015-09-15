
(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var terminalDirPath = "C:/";
	var BASE_URL = "http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?";
    var app;
    var absolutePath="";
    var fileName_mail="";
    // create an object to store the models for each     
    function attachOnclickListener(element){
        element.on('click',function(event){
          var target = event.target;
          $(target).css('background-color','#93bde1');
          if(target){
              var data = $(target).text();
              var type = $(target).data('type');
              if(type == "1"){
                  
                  fileName_mail=absolutePath+"/"+data;
        		  var url="http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command="+absolutePath+"/"+data+"&username=NBHYDMAZIMUDD7&password=password";        
                  fileAction(url);
              }else{
                  if(absolutePath == ""){
                      absolutePath=data;
                  }else{
                  absolutePath=absolutePath+"/"+data;              
              }
	              var url="http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command=DIR>"+absolutePath +"&username=NBHYDMAZIMUDD7&password=password";
    	          getFileStructure(url);
              }
             }     
       });
    }
    function renderNavBar(){
        var path=absolutePath.split('/');
        for(i=0;i<path.length;i++){
            var element = $("<li>"+path[i]+"</li>");
            element.data('data',path[i]);    
            $("#navbar").append(element);
        }
        
        
    }
    function renderDriveList(response){
        //renderNavBar();
        for(var i=0;i<response.list.length;i++){
	            var element = $("<li><img src='images/drive-icon.png' alt='folderIcon' width='30px' height='30px'><span style='margin-left:10px;'>"+response.list[i]['drive']+"</span></li>");
                   element.data('data',response.list[i]['drive']);
            	   element.data('type',response.list[i]['type']);
                   element.children('span').data('data',response.list[i]['drive']);
            	   element.children('span').data('type',response.list[i]['type']);
    
                   attachOnclickListener(element);
                  $("#latitudes").append(element);
          }     
    }
    function renderFileList(response){
        //renderNavBar();
        for(var i=0;i<response.list.length;i++){
            if(response.list[i]['type']==1){
              var element = $("<li><img src='images/file-icon.png' alt='fileIcon' width='30px' height='30px'><span style='margin-left:10px;'>"+response.list[i]['name']+"</span></li>");
            }else{
                var element = $("<li><img src='images/folder_with_file.png' alt='folderIcon' width='30px' height='30px'><span style='margin-left:10px;'>"+response.list[i]['name']+"</span></li>");
            }
            	console.log(element);
            	
                   element.data('data',response.list[i]['name']);
            	   element.data('type',response.list[i]['type']);
            	   element.children('span').data('data',response.list[i]['drive']);
                   element.children('span').data('type',response.list[i]['type']);
                   attachOnclickListener(element);
                  $("#latitudes").append(element);
        }
    }
    function getDrives(){
        $.ajax({
                      url: 'http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command=DRIVES&username=NBHYDMAZIMUDD7&password=password',
                      type: 'GET',
                     dataType: "text",
                    //  data: 'address=iLabs+Madhapur+Hyderabad+India&key=AIzaSyDxoD0MXQq_2Eo0kFPzaHiqD7I5h7cW9zU',
                      success: function(data) {                          
                          $('#latitudes').empty();
                          var response = JSON.parse(data);
                          renderDriveList(response);
                          console.log(data);
                      },
                      error: function(e) {
                        //called when there is an error
                          alert("failure");
                        console.log(e.message);
                      }
                    });
            }
    function getFileStructure(url){
        $.ajax({
                      url: url,
                      type: 'GET',
                     dataType: "text",
                    //  data: 'address=iLabs+Madhapur+Hyderabad+India&key=AIzaSyDxoD0MXQq_2Eo0kFPzaHiqD7I5h7cW9zU',
                      success: function(data) {                          
                          $('#latitudes').empty();
                          var response = JSON.parse(data);
                          
                          renderFileList(response);
                          console.log(data);
                                                
                      },
                      error: function(e) {
                        //called when there is an error
                          alert("failure");
                        console.log(e.message);
                      }
                    });        
    }
     function fileAction(url){
        $.ajax({
                      url: url,
                      type: 'GET',
                     dataType: "text",
                    //  data: 'address=iLabs+Madhapur+Hyderabad+India&key=AIzaSyDxoD0MXQq_2Eo0kFPzaHiqD7I5h7cW9zU',
                      success: function(data) {                          
                          console.log(data);
                                                
                      },
                      error: function(e) {
                        //called when there is an error
                          alert("failure");
                        console.log(e.message);
                      }
                    });        
    }
    
	function getTerminalCmdOutputAjax(command) {
		var requestParms = "command=TERMINAL>" + terminalDirPath + " %26%26 " + command +"&username=NBHYDMAZIMUDD7&password=password";
		var url = BASE_URL + requestParms;
		$.ajax({
			url: url,
            type: 'GET',
            dataType: "text",
            success: function(data) {
				var responseJson = JSON.parse(data);
                if(responseJson.success) {
                    if(responseJson.path) {
                        terminalDirPath = $.trim(responseJson.path);
                    }
                	$("#termialResultArea").val($("#termialResultArea").val() + "\n\n" + terminalDirPath + ">" + command + "\n"+ responseJson.output);
                    $("#commandLine").val("");
                }
            },
			error: function(e) {
                console.log(e.message);
              }
		});     
    }
    
    window.APP = {
      models: {
         index: {
          title:'Index'
      	},
        settings: {
          title: 'settings',
             fetchJson:function(e){
                }
        },
        home: {
          title: 'Home',
             backButton:function(e){
                  var path=absolutePath.split("/");
                  absolutePath=absolutePath.substring(0,absolutePath.length - path[path.length-1].length -1);
                 if(absolutePath==""){
                     getDrives();
                 }else{
                     var url="http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command=DIR>"+absolutePath +"&username=NBHYDMAZIMUDD7&password=password";
                     getFileStructure(url);
                 }
                  
             },
             fetchJson:function(e){
                //alert("hi");
                 var url="http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command=DIR>"+absolutePath +"&username=NBHYDMAZIMUDD7&password=password";
                 getFileStructure(url);
            },
			fetchJson1:function(e){
                //alert("hi");
                $("#back_button").removeAttr("disabled");
                 $.ajax({
                      url: 'http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command=DRIVES&username=NBHYDMAZIMUDD7&password=password',
                      type: 'GET',
                     dataType: "text",
                    //  data: 'address=iLabs+Madhapur+Hyderabad+India&key=AIzaSyDxoD0MXQq_2Eo0kFPzaHiqD7I5h7cW9zU',
                      success: function(data) {  
                          absolutePath="";
                          $('#latitudes').empty();                        
                          var response = JSON.parse(data);
                          console.log(data);
                          renderDriveList(response);
                      },
                      error: function(e) {
                        //called when there is an error
                          alert("failure");
                        console.log(e.message);
                      }
                    });
            }
        },
		terminal: {
			title: 'Terminal',
			executeTerminalCmdAjax:function(e) {
				if($("#commandLine").val()) {
					getTerminalCmdOutputAjax($("#commandLine").val());
                }
            }
		},
        contacts: {
          title: 'Task Name',
          ds: new kendo.data.DataSource({
            data: [{ id: 1, name: 'Prepare for presentation' }]
          }),
           fetchJson2:function(e){
               },
          add: function(e) {
              var newTask = this.get('taskName');
              var dataSource = this.get('ds');
              dataSource.add({name:newTask});
              this.set('taskName','')
          }
        },email: {
          title: 'Email',
          ds: new kendo.data.DataSource({
            data: [{ id: 1, name: 'Prepare for presentation' }]
          }),
           fetchJson2:function(e){
               
               $("#attach").val(fileName_mail);
               },
          add1: function(e) {
              
          	 var mail =$("#mail").val();
               var attach =fileName_mail;
               var sub =$("#sub").val();
               var body =$("#body").val();
              
           
              var url="http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command=EMAIL>";
              url=url+ mail+" "+ sub+" "+ body+" "+ attach+"&username=NBHYDMAZIMUDD7&password=password";
              
              console.log(url);
              $.ajax({
                      url: url,
                      type: 'POST',
                     dataType: "text",
                    //  data: 'address=iLabs+Madhapur+Hyderabad+India&key=AIzaSyDxoD0MXQq_2Eo0kFPzaHiqD7I5h7cW9zU',
                      success: function(data) {                          
                          var response = JSON.parse(data);
                          console.log(data);
                       //   renderDriveList(response);
                      },
                      error: function(e) {
                        //called when there is an error
                          alert("failure");
                        console.log(e.message);
                      }
                    });
              app.navigate("views/home.html");
              
          },
		} 
          
      }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
      
      // hide the splash screen as soon as the app is ready. otherwise
      // Cordova will wait 5 very long seconds to do it for you.
      navigator.splashscreen.hide();

      app = new kendo.mobile.Application(document.body, {
        
        // comment out the following line to get a UI which matches the look
        // and feel of the operating system
        skin: 'nova',

        // the application needs to know which view to load first
        initial: 'views/connect.html'
      });

    }, false);


}());