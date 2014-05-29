<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
  <head>
    <title>{% block headtitle %}Title{% endblock %}</title>
    <link href="/stylesheets/style.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>
    {% block content %}Contents{% endblock %}
  </body>
</html>{#-
vim: ft=htmldjango et sw=2 sts=2 ts=2 tw=0:
-#}
