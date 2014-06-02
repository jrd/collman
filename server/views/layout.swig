<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
    <title>{% block headtitle %}Title{% endblock %}</title>
    <link href="/css/collman.css" rel="stylesheet" type="text/css"/>
  </head>
  <body ng-app="collMan">
    {% block content %}Contents{% endblock %}
    {% block scripts %}{% endblock %}
  </body>
</html>{#-
vim: ft=htmldjango et sw=2 sts=2 ts=2 tw=0:
-#}
