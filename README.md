# node-auth

une application permettant de s’inscrire via des informations d'un utilisateur.

Au premier accès, l’utilisateur doit se créer un compte (email, mdp) sur la route /register

Une fois le compte créé, l’utilisateur doit utiliser la route /login pour récupérer un token.

Une fois logué, l’utilisateur peut accéder à la liste des utilisateurs déjà enregistrés sur la plateforme via la route /users.
