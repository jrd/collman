{%- extends "layout.swig" -%}
{%- block content -%}
<div class="container" ng-view=""></div>
{%- endblock -%}
{%- block scripts %}
<script src="/js/vendor.js"></script>
<script src="/js/app.js"></script>
{% endblock -%}{#-
vim: ft=htmldjango et sw=2 sts=2 ts=2 tw=0:
-#}
