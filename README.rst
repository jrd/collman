=======
CollMan
=======

The generalist *collection manager*.

With this **wonderful** application you can achieve to **sort** your collection, **know what you have**, **know to whom you lent** a book, a movie, a game, …
And you can do this straight from your web browser ``d^_^b``

This comes in two parts for now:

- the server: which is in javascript (node.js)
- the client: web application (angular & co)

How to install
==============

Requirements
------------
*Node.js* should have been installed.

Server
------
.. code:: sh

  $ cd server
  $ npm install

Run the server

.. code:: sh

  $ npm start

WebApp
------
.. code:: sh

  $ cd pages
  $ sudo npm install -g grunt-cli
  $ sudo npm install -g bower
  $ npm install
  $ grunt
