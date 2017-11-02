// Execute JavaScript on page load
$(function() {
    
    // Initialize phone number text input plugin
    $('#phoneNumber, #salesNumber ,#outgoing').intlTelInput({
        responsiveDropdown: true,
        autoFormat: true,
        utilsScript: '/vendor/intl-phone/libphonenumber/build/utils.js'
    });

    // Intercept form submission and submit the form with ajax
    $('#contactForm').on('submit', function(e) {
        // Prevent submit event from bubbling and automatically submitting the
        // form
        e.preventDefault();

        // Call our ajax endpoint on the server to initialize the phone call
        $.ajax({
            url: '/call',
            method: 'POST',
            dataType: 'json',
            data: {
                phoneNumber: $('#phoneNumber').val(),
                salesNumber: $('#salesNumber').val(),
                outgoing: $('#outgoing').val()
            }
        }).done(function(data) {
            // The JSON sent back from the server will contain a success message
            alert(data.message);
        }).fail(function(error) {
            alert(JSON.stringify(error));
        });
    });


    $('#loginForm').on('submit', function(e){
          e.preventDefault();
        $.ajax({
                    url: '/login',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        email: $('#email').val(),
                        password: $('#password').val(),
                    }
                }).done(function(data) {
                    alert(data.message)
                    window.location.href = "/app/makecall?" + "agentnbr="+data.message
                    // The JSON sent back from the server will contain a success message
                }).fail(function(error) {
                   
                });
    });
});
