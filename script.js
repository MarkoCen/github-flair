(function ($, themes) {

    var API_BASE_URL = "https://api.github.com/";
    var LOCATION_ICON = '<svg height="12" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>';
    var GITHUB_CORNER = '<svg title="GitHub Flair" width="30" height="30" viewBox="0 0 250 250"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor"></path></svg>';
    var FOLLOWERS_ICON = '<svg height="12" viewBox="0 0 16 16" width="12"><path fill-rule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4"></path></svg>';
    var REPO_ICON = '<svg height="12" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>';
    var GIST_ICON = '<svg height="12" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M7.5 5L10 7.5 7.5 10l-.75-.75L8.5 7.5 6.75 5.75 7.5 5zm-3 0L2 7.5 4.5 10l.75-.75L3.5 7.5l1.75-1.75L4.5 5zM0 13V2c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v11c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1zm1 0h10V2H1v11z"></path></svg>';
    var RAINBOW_STYLE = '.github-flair-rainbow-avatar{position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin:-3px;border-width: 3px;border-top-style: dotted;border-bottom-style: dotted;border-left-style: dotted;border-right-style: dotted;border-color: hsl(250, 90%, 50%);animation: rainbow 5s infinite alternate, spin 10s linear infinite;border-radius: 50%;}@keyframes rainbow {0% {border-color: hsl(250, 90%, 50%);}100% {border-color: hsl(360, 90%, 50%);}}@keyframes spin {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}';
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
                resetThemes(themes);
                getStars(data);
                var flairs = getFlairs();
                var flairContainer = $('.flair-container');
                flairContainer.empty();
                flairs.forEach(function(flair){
                    flairContainer.append(getFlairSection(flair));
                })
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

    function resetThemes(themes){
        var isRound = isRoundAvatar();
        var themeKeys = Object.keys(themes);
        themeKeys.forEach(function (themeKey) {
            themes[themeKey]['avatarImg']['border-radius'] = isRound ? '50%':'0';
        })
    }

    function getFlairSection(flairNode){
        var div = document.createElement('DIV');
        var divFlair = document.createElement('DIV');
        var divText = document.createElement('DIV');
        var textArea = document.createElement('TEXTAREA');
        div.className = "col-xs-12";
        divFlair.className = "col-xs-6 flair-wrap";
        divFlair.appendChild(flairNode);
        divText.className = "col-xs-6 text-wrap";

        textArea.value = $(flairNode).prop('outerHTML');
        textArea.readOnly = 'readOnly';
        textArea.onclick = function(){
            this.focus();
            this.select();
        };
        divText.appendChild(textArea);
        
        div.appendChild(divFlair);
        div.appendChild(divText);
        return div;
    }

    function getFlairs(){
        var themeKeys = Object.keys(themes);
        var flairs = [];
        for(var i = 0; i < themeKeys.length; i++){
            flairs.push(flairTemplate(themes[themeKeys[i]]));
        }
        return flairs;
    }

    //example data https://api.github.com/users/umanusorn?
    function getProfile(userData){
        profile.avatar = userData['avatar_url'];
        profile.link = userData['html_url'];
        profile.username = userData['login'];
        profile.location = userData['location'];
        profile.blog = userData['blog'];
        profile.company = userData['company'];
        profile.bioinfo = userData['bio'];

        profile.followers = truncateNum(userData['followers']);
        profile.followerUrl = userData['followers_url'];
        profile.followings = truncateNum(userData['followings']);
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

        if(isDisplayRainbow()){
            div.appendChild(rainbowStyleTemplate());
        }
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

        if(isDisplayRainbow()){
            var divBorder = document.createElement('DIV');
            divBorder.className = 'github-flair-rainbow-avatar';
            div.appendChild(divBorder);
        }
        div.appendChild(a);
        return div;
    }

    function rainbowStyleTemplate(){
        var style = document.createElement('STYLE');
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = RAINBOW_STYLE;
        } else {
            style.appendChild(document.createTextNode(RAINBOW_STYLE));
        }
        return style;
    }

    function infoTemplate(theme){
        var div = document.createElement('DIV');
        div.className = 'info';
        div.style = styleString(theme['info']);

        var nameNode = nameTemplate(profile.username, profile.link, theme);
        var nameNode = bioInfoTemplate(profile.bioinfo, profile.link, theme);
        var metaNode = metaTemplate(profile.followers, profile.repos, profile.gists, theme);
        var locNode = locationTemplate(profile.location, theme);
        var blogNode = blogTemplate(profile.blog, theme);

        div.appendChild(nameNode);
        div.appendChild(metaNode);
        
        if(locNode && isDisplayLocation()) 
            div.appendChild(locNode);
        if(blogNode && isDisplayWebsite()) 
            div.appendChild(blogNode);
        return div;
    }

     function bioInfoTemplate(info, theme){
        if(!info) return;
        var div = document.createElement('DIV');
        var span = document.createElement('SPAN');
        div.className = 'user-profile-bio';
        span.innerHTML = '&nbsp;' + info;
        if(isDisplayBioInfo())
            div.appendChild(span);
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

    function metaTemplate(followerCount, repoCount, gistCount, theme){
        var div = document.createElement('DIV');
        div.className = 'meta';
        var followerSpan = document.createElement('SPAN');
        var repoSpan = document.createElement('SPAN');
        var gistSpan = document.createElement('SPAN');

        followerSpan.innerHTML = FOLLOWERS_ICON + ' ' + followerCount + '&nbsp;&nbsp;';
        repoSpan.innerHTML = REPO_ICON + ' ' + repoCount + '&nbsp;&nbsp;';
        gistSpan.innerHTML = GIST_ICON + ' ' + gistCount;

        followerSpan.firstChild.style = styleString(theme['svgIcon']);
        repoSpan.firstChild.style = styleString(theme['svgIcon']);
        gistSpan.firstChild.style = styleString(theme['svgIcon']);

        followerSpan.title = 'Followers';
        repoSpan.title = 'Total Public Repositories';
        gistSpan.title = 'Total Public Gists';

        if(isDisplayFollowers()) div.appendChild(followerSpan);
        div.appendChild(repoSpan);
        div.appendChild(gistSpan);
        return div;
    }
    
    function blogTemplate(url, theme) {
        if(!url) return;
        var div = document.createElement('DIV');
        var a = document.createElement('A');
        div.className = 'blog';
        a.href = /^https?:\/\//.test(url) ? url : 'http://' + url;
        a.target = "_blank";
        a.innerHTML = 'Blog / Website';
        a.style = styleString(theme['textLink']);
        div.appendChild(a);
        return div;
    }

    function locationTemplate(loc, theme){
        if(!loc) return;
        var div = document.createElement('DIV');
        var span = document.createElement('SPAN');
        div.className = 'location';
        div.insertAdjacentHTML('afterbegin', LOCATION_ICON);
        var svg = div.firstChild;
        svg.style = styleString(theme['svgIcon']);
        span.innerHTML = '&nbsp;' + loc;
        div.appendChild(span);
        return div;
    }
  
    function isDisplayRainbow() {
        return $('.display-rainbow')[0].checked;
    }

    function isDisplayWebsite() {
        return $('.display-website')[0].checked;
    }

    function isDisplayFollowers() {
        return $('.display-followers')[0].checked;
    }

    function isDisplayLocation() {
        return $('.display-location')[0].checked;
    }

    function isRoundAvatar(){
        return $('.round-avatar')[0].checked;
    }
    
    function isDisplayBioInfo(){
        return $('.display-bio-info')[0].checked;
    }

})(window.jQuery, window.flairThemes);
