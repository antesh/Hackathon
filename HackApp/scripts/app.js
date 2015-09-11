
(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;
    var absolutePath="";
	var absolutePath="";
    // create an object to store the models for each view    
    function attachOnclickListener(element){
        element.on('click',function(event){
          var target = event.target;
          if(target){
              var data = $(target).data('data');
              if(absolutePath == ""){
                  absolutePath=data;
              }else{
              absolutePath=absolutePath+"/"+data;              
              }              
              var url="http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command=DIR>"+absolutePath +"&username=NBHYDMAZIMUDD7&password=password";
              getFileStructure(url);
             }     
       });
    }
    function renderNavBar(){
        var path=absolutePath.split('/');
        for(i=0;i<path.length;i++){
            var element = $("<li><a href='#secondview'>"+path[i]+"</a></li>");
            element.data('data',path[i]);    
            $("#navbar").append(element);
        }
        
        
    }
    function renderDriveList(response){
        renderNavBar();
        for(var i=0;i<response.list.length;i++){
                  var element = $("<li><a href='#secondview'>"+response.list[i]['drive']+"</a></li>");
                   element.data('data',response.list[i]['drive']);                    
                   attachOnclickListener(element);
                  $("#latitudes").append(element);
          }     
    }
    function renderFileList(response){
        renderNavBar();
        for(var i=0;i<response.list.length;i++){
              var element = $("<li><a href='#secondview'>"+response.list[i]['name']+"</a></li>");
                   element.data('data',response.list[i]['name']);                    
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
                          renderStructureList(response);
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
                 $.ajax({
                      url: 'http://192.168.196.70:7080/RemoteServer/servlet/uiaction.jsrv?command=DRIVES&username=NBHYDMAZIMUDD7&password=password',
                      type: 'GET',
                     dataType: "text",
                    //  data: 'address=iLabs+Madhapur+Hyderabad+India&key=AIzaSyDxoD0MXQq_2Eo0kFPzaHiqD7I5h7cW9zU',
                      success: function(data) {                          
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
        skin: 'flat',

        // the application needs to know which view to load first
        initial: 'views/contacts.html'
      });

    }, false);


}());