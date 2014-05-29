{%- extends "layout.swig" -%}
{%- block content -%}
<h1>{{ message }}</h1>
<h2>{{ error.status }}</h2>
<pre>
{{ error.stack }}
</pre>
{%- endblock -%}{#-
vim: ft=htmldjango et sw=2 sts=2 ts=2 tw=0:
-#}
