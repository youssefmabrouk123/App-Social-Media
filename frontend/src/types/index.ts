export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    filiere: string ;
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    birthDate: string;
    age: string;
    bio: string;
    imageUrl: string;
    post:any[];
    savedPosts:any[];
    likedInteractions:any[];
  };


  

  export type CVote = {
    question: string ;
    description: string;
    yesCount: string;
    noCount: string;
    date: string;
    decision: string;
    DelegueName: string;
  
  };
  



  export type CUser = {
    filiere: string | undefined;
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    age: string;
    bio: string;
    imageUrl: string;
    post:any[];
  
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };