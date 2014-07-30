
var $mainContent = $('.mainContent').hide(),
    $login = $('#login').modal('show'),
    $userList = $('.userList'),
    $messageList = $('.messageList'),
    username;

//Socket.io
var socket = io.connect();

socket.on('login', function(data) {
    if(!data) return;

    if(data.status == 'success' && Array.isArray(data.users)) {
        $('#onlineUserCount').html(data.users.length);
        $.each(data.users, function() {
            $userList.append($('<li class="userItem"/>').data('username', this).html(this));
        });

        $mainContent.show();
        $login.modal('hide');
    }
    else if(data.loginUser) {
        var username = data.loginUser;
        $userList.append($('<li class="userItem"/>').data('username', username).html(username));
        $messageList.append($('<li/>').html('<span class="messageItem_username">' + username + '</span>' + ' login'));
    }
    else if(data.status == 'error') {
        $('#alert-existUsername').show();
    }
});

socket.on('message', function(data) {
    var li = [
        '<li class="messageItem">',
            '<span class="messageItem_username">' + data.sender + '</span>',
            '<span class="messageItem_time">' + data.time + '</span>',
            '<p class="messageItem_content">' + data.content + '</p>',
        '</li>'
    ].join('');

    var currentScroll = $messageList.scrollTop(),
        scrollUnitHeight = 100,
        isNearEnd = false;

    $messageList.scrollTop(currentScroll + scrollUnitHeight);

    if($messageList.scrollTop() < currentScroll + scrollUnitHeight) {
        isNearEnd = true;
    }

    $messageList.append(li);

    if(isNearEnd) {
        do {
            currentScroll += scrollUnitHeight;
            $messageList.scrollTop(currentScroll);
        } while($messageList.scrollTop() == currentScroll)
    }
    else {
        $messageList.scrollTop(currentScroll);
    }
});

socket.on('logout', function(username) {
    if(username) {
        $userList.find('li').each(function() {
            var $li = $(this);
            if($li.data('username') == username) {
                $li.remove();
                $messageList.append($('<li/>').html('<span class="messageItem_username">' + username + '</span>' + ' logout'));
                return false;
            }
        });
    }
});

$('#btnChooseUsername').on('click', function() {
    var username = $('#txtUsername').val();
    if(username) {
        socket.emit('login', username);
    }
});

$('#btnSendMessage').on('click', function() {
    var message = $('#txtMessage').val();
    if(message) {
        socket.emit('message', message);
    }
});