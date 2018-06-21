/**
 * @GIT is global object which is wrapper for all the utulity methods.
 * checking if GIT is defined use it else, need to create new object
 */

 var GIT = GIT || {};


 /**
  * @Utils is wrapper for all the methods
  */

GIT.utils = {

    /**
     * @init Fitst method to be executed on this file.
     */
    init: function(){
        this.clickables();
        this.showNotification("Howdy User..! Welcome to GIT application");
    },
    /**
     * All the clickable elements are initialised here
     */
    clickables: function(){
        _self=this;

        $(".getdata").click(function(){
            $('#loader').removeClass('hide');
            _self.fetchData();
        });

        $(document).on('click', '.createissue', function() { 
            var url = $(this).attr("data-issue-url");
            $(".createissuewrapper").attr("data-issue-url",url).removeClass("hide"); 
        });

        $(document).on('click', '.createissuewrapper .close', function() { 
            $(".title").val("");
            $(".description").val("");
            $(".createissuewrapper").addClass("hide");
        });

        $(document).on('click', '.updateissue', function(){
            var url ="";
            var url = $(this).attr("data-issue-url");
            var title = $(".title").val() || "Default Message";
            var description = $(".description").val() || "Default Description";
            _self.createissue(title,description);

        });
    },
    /**
     * @fetchData - is to get the details of the user repo
     * this data has been captured form the ".username" input field
     */
    fetchData: function(){
        _self = this;
        var username = $('.username').val();
        var requri   = 'https://api.github.com/users/'+username;
        var repouri  = 'https://api.github.com/users/'+username+'/repos';



        var request = $.ajax({
            url: requri,
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "token d666281fbf00e22c7c5031b18c2400782396b2e1");
            }
          });

          request.done(function(json) {

            $('.error-container, .result-container').addClass("hide");

            if(json.message == "Not Found" || username == '') {
              $('.error-container').removeClass("hide");
            }
            else {
                $('#loader').addClass('hide');
                $('.result-container').removeClass("hide");
                var repositories="",
                    fullname = json.name,
                    aviurl = json.avatar_url,
                    profileurl = json.html_url,
                    name =  json.name,
                    followersnum = json.followers,
                    followingnum = json.following,
                    reposnum = json.public_repos,
                    cusername = json.login;
              
                if(fullname === undefined) { fullname = cusername; }
                
                var outhtml = '<div class="row mb-thirty">';
                    outhtml = outhtml+'<div class="col-xs-12 col-sm-3">';
                    outhtml = outhtml+'<img src="'+aviurl+'" width="100%" alt="naveenkumarpg"><br/>';
                    outhtml = outhtml+'</div>';
                    outhtml = outhtml+'<div class="col-xs-12 col-sm-9">';
                    outhtml = outhtml+'<p>User Name : '+'<a target="_blank" href='+profileurl+'>'+cusername+'</a></p>';
                    outhtml = outhtml+'<p>Name : '+name+'</a></p>';
                    outhtml = outhtml+'<p>Followers : '+followersnum+'</p>';
                    outhtml = outhtml+'<p>Following : '+followingnum+'</p>';
                    outhtml = outhtml+'<p>Repos : '+reposnum+'</p>';
                    outhtml = outhtml+'</div></div>';
                
                    _self.getrepos(repouri, outhtml);
            }
          });
           
          request.fail(function( jqXHR, textStatus ) {
              _self.showNotification("Something went wrong, Please try some time later");
          });
    },
    getrepos: function(requri,outhtml){
        _self=this;

        var request = $.ajax({
            url: requri,
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "token d666281fbf00e22c7c5031b18c2400782396b2e1");
            }
        }); 

        request.done(function(json) {
            _self.outputPageContent(json,outhtml);
        });

        request.fail(function( jqXHR, textStatus ) {
            _self.showNotification("Something went wrong, Please try some time later");
        });
    },
    /**
     * @outputPageContent - this method will be checking fetchData is valid and user has repos, 
     * repos will be rendered against user details in the form of table
     */
    outputPageContent : function(repositories,outhtml) {
        if(repositories.length === 0) { 
            outhtml = outhtml + '<p>No repos!</p></div>'; 
        } else {
          outhtml = outhtml + '<p><strong>Repos List:</strong></p> <table class="table">';
          $.each(repositories, function(index) {
            outhtml = outhtml + '<tr class="repo-row">';
            outhtml = outhtml + '<td class="number" >'+(index+1)+'</td>';
            outhtml = outhtml + '<td><a href="'+repositories[index].html_url+'" target="_blank">'+repositories[index].name + '</a>';
            outhtml = outhtml + '<span data-user="'+repositories[index].owner.login+'" data-issue-url="'+repositories[index].issues_url+'" class="createissue btn btn-primary">New Issue</span></td>';
            outhtml = outhtml + '</tr>';
          });
          outhtml = outhtml + '</table></div>'; 
        }
        
        $('.result-container').html(outhtml);
    },
    createissue: function(title, description){
        url = $(".createissuewrapper").attr("data-issue-url").replace("{/number}","");
        var params = {
            title: title,
            body: description
          };
          $.ajax({
            url: url,
            type: "POST",
            beforeSend: function(xhr){
              xhr.setRequestHeader("Authorization", "token d666281fbf00e22c7c5031b18c2400782396b2e1");
            },
            data: JSON.stringify(params),
            complete: function(xhr) {
                $(".createissuewrapper").addClass("hide");
                _self.showNotification("You have sucessfully created the issue on the repository");
            }
          });
    },
    showNotification : function(text){
        _self = this;

        $(".notification").text(text).slideDown();
        setTimeout(function(){
            _self.hidenotification();
        },2000); 
    },
    hidenotification: function(){
        $(".notification").slideUp(400); 
    }
};

$(document).ready(function(){
    GIT.utils.init();
});



   

    



    
