 $(document).ready(
     function() {
         $('input:file').change(
             function() {
                 if ($(this).val()) {
                     $('button').removeAttr('disabled');
                 }
             }
         );
     });

 $('#irisType').hide();
 $('#help').click(function() {
     if ($(this).is(':checked')) {
         $('#irisType').show();
     } else {
         $('#irisType').hide();
     }
 });