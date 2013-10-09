Package.describe({
    summary: "A jQuery plugin to edit JSON data"
});

Package.on_use(function(api) {
    api.use('standard-app-packages', ['client']);
    api.use('jquery', ['client']);

    api.add_files('jquery.jsonEdit.js', ['client']);
    api.add_files('jsonEdit.css'      , ['client']);

});

