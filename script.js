(function ($, styles) {

    var API_BASE_URL = "https://api.github.com/";
    var profile = {};

    $('.generate').click(start);
    $('.username').on('keypress', function (event) {
        if(event.keyCode === 13) start();
    });

    function start(){
        var username = getInput();
        profile = {};
        if(!username) {}
        getUser(username).then(getProfile);
        getRepos(username).then(getStars);
    }

    function getInput(){
        return $('.username').val();
    }

    function getUser(username){
        var url = API_BASE_URL + 'users/' + username;
        return $.get(url);
    }

    function getRepos(username){
        var url = API_BASE_URL + 'users/' + username + '/repos';
        return $.get(url);
    }

    function getProfile(userData){
        profile.avatar = userData['avatar_url'];
        profile.link = userData['html_url'];
        profile.username = userData['login'];
        profile.location = userData['location'];
        profile.blog = userData['blog'];
        profile.company = userData['company'];

        profile.followers = userData['followers'];
        profile.followerUrl = userData['followers_url'];
        profile.followings = userData['followings'];
        profile.followingUrl = userData['following_url'];

        profile.gists = userData['public_gists'];
        profile.gistUrl = userData['gists_url'];
        profile.repos = userData['public_repos'];
        profile.repoUrl = userData['repos_url'];

    }

    function getStars(repoData) {
        var stars = 0;
        $.each(repoData||[], function (index, repo) {
            stars += parseInt(repo['stargazers_count'], 10);
        });
        profile.stars = stars;
    }
    
    function avatarTemplate() {
        
    }

})(window.jQuery, window.flairStyles);