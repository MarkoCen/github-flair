(function ($, themes) {

    var API_BASE_URL = "https://api.github.com/";
    var LOCATION_ICON = '<svg height="12" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>';
    var GITHUB_CORNER = '<svg width="30" height="30" viewBox="0 0 250 250"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor"></path></svg>';
    var profile = {};

    $('.generate').click(start);
    $('.username').on('keypress', function (event) {
        if(event.keyCode === 13) start();
    });

    function start(){
        var username = getInput();
        profile = {};
        if(!username) {}
        getUser(username).then(function(data){
            getProfile(data);
            getRepos(username).then(function(data){
                getStars(data);
                var flair = flairTemplate(themes.default);
                $('.container').append(flair);
            });
        });
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

        profile.gists = truncateNum(userData['public_gists']);
        profile.gistUrl = userData['gists_url'];
        profile.repos = truncateNum(userData['public_repos']);
        profile.repoUrl = userData['repos_url'];

    }

    function getStars(repoData) {
        var stars = 0;
        $.each(repoData||[], function (index, repo) {
            stars += parseInt(repo['stargazers_count'], 10);
        });
        profile.stars = truncateNum(stars);
    }

    function truncateNum(number){
        var num = parseInt(number, 10);
        if(num < 1000) return num;
        return (num / 1000).toFixed(1) + 'k';
    }

    function styleString(styleObj){
        var keys = Object.keys(styleObj);
        var str = '';
        for(var i = 0; i < keys.length; i++){
            str += keys[i]+':'+styleObj[keys[i]]+';';
        }
        return str;
    }

    function flairTemplate(theme){
        var div = document.createElement('DIV');
        div.className = 'github-flair';
        div.style = styleString(theme['flair']);

        var githubCornerNode = githubCornerTemplate(theme);
        var avatarNode = avatarTemplate(profile.avatar, profile.link, theme);
        var infoNode = infoTemplate(theme);

        div.appendChild(githubCornerNode);
        div.appendChild(avatarNode);
        div.appendChild(infoNode);

        return div;
    }

    function githubCornerTemplate(theme){
        var div = document.createElement('DIV');
        div.innerHTML = GITHUB_CORNER;
        var svg = div.firstChild;
        svg.className = 'github-corner';
        svg.style = styleString(theme['githubCorner']);
        return svg;
    }

    function avatarTemplate(imageUrl, profileUrl, theme) {
        var div = document.createElement('DIV');
        var a = document.createElement('A');
        var img = document.createElement('IMG');
        a.href = profileUrl;
        a.target = '_blank';
        img.src = imageUrl;
        img.alt = 'Profile Avatar';
        img.style = styleString(theme['avatarImg']);
        a.appendChild(img);
        div.className = 'avatar';
        div.style = styleString(theme['avatar']);
        div.appendChild(a);
        return div;
    }

    function infoTemplate(theme){
        var div = document.createElement('DIV');
        div.className = 'info';

        var nameNode = nameTemplate(profile.username, profile.link, theme);
        var metaNode = metaTemplate(profile.stars, profile.repos, profile.gists);
        var locNode = locationTemplate(profile.location);
        var blogNode = blogTemplate(profile.blog);

        div.appendChild(nameNode);
        div.appendChild(metaNode);
        div.appendChild(locNode);
        div.appendChild(blogNode);

        return div;
    }

    function nameTemplate(name, link, theme) {
        var div = document.createElement('DIV');
        var a = document.createElement('A');
        a.href = link;
        a.target = '_blank';
        a.innerHTML = name;
        a.style = styleString(theme['textLink']);
        div.className = 'name';
        div.style = styleString(theme['name']);
        div.appendChild(a);
        return div;
    }

    function metaTemplate(starCount, repoCount, gistCount){
        var div = document.createElement('DIV');
        div.className = 'meta';
        var starSpan = document.createElement('SPAN');
        var repoSpan = document.createElement('SPAN');
        var gistSpan = document.createElement('SPAN');

        starSpan.innerHTML = '&#9733;' + starCount + '&nbsp;&nbsp;';
        repoSpan.innerHTML = '&#9776; ' + repoCount + '&nbsp;&nbsp;';
        gistSpan.innerHTML = '&#9998; ' + gistCount;

        starSpan.title = 'Total Public Stargazers';
        repoSpan.title = 'Total Public Repositories';
        gistSpan.title = 'Total Public Gists';

        div.appendChild(starSpan);
        div.appendChild(repoSpan);
        div.appendChild(gistSpan);

        return div;
    }
    
    function blogTemplate(url) {
        if(!url) return;
        var div = document.createElement('DIV');
        var a = document.createElement('A');
        div.className = 'blog';
        a.href = url;
        a.target = "_blank";
        a.innerHTML = 'Blog / Website';
        div.appendChild(a);
        return div;
    }

    function locationTemplate(loc){
        if(!loc) return;
        var div = document.createElement('DIV');
        var span = document.createElement('SPAN');
        div.className = 'location';
        div.insertAdjacentHTML('afterbegin', LOCATION_ICON);
        span.innerHTML = '&nbsp;' + loc;
        div.appendChild(span);
        return div;
    }

})(window.jQuery, window.flairThemes);