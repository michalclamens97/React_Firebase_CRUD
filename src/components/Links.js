import React, { useEffect, useState } from "react";
import LinkForm from "./LinkForm";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Links = () => {
  const [links, setLinks] = useState([]);
  const [currentId, setCurrentId] = useState(""); //this currentId is going to tell me if the user click the update icon or not

  //Function to save or update the data to the database
  const addOrEditLink = async (linkObject) => {
    try {
      if (currentId === "") {
        // console.log(linkObject);
        await db.collection("links").doc().set(linkObject); //function from firebase: create a collection name 'links' in the database, what i want to save inside links is a new document with the data that I pass as parameter to the function (i pass this data in LinkForms.js)
        toast("New link added!", {
          type: "success",
        });
      } else {
        await db.collection("links").doc(currentId).update(linkObject);
        toast("Link was Updated!", {
          type: "info",
        });
        setCurrentId("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Function to delete a link
  const onDeleteLink = (id) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      //console.log(id);
      db.collection("links").doc(id).delete(); //from my collection "links" delete the document that have this id
      toast("Link deleted!", {
        type: "error",
        autoClose: 2000,
      });
    }
  };

  //Function to update, if the state currentId exist this means that the user is trying to update a link (the update icon has a onclick function that gives the value of the link id that is being click to the state currentId)

  //Function to get all the links from the firebase ddbb
  const getLinks = async () => {
    db.collection("links").onSnapshot((querySnapshot) => {
      const docs = []; //array where im going to store the link(objects) combined with the property id for each link (object)
      //if we use .get() we get all the data, but with onSnapshot we can get all the data everytime that the database has been modified (something was add,delete,modified,etc), in this case we are executing a function that shows the result of the query meaning it shows all the link

      querySnapshot.forEach((doc) => {
        //console.log(doc.data());
        //console.log(doc.id);
        docs.push({ ...doc.data(), id: doc.id }); //I save in my array a new object with the data(object) of the doc(the link that I'm looping) and the id of that link, meaning that im creating a new object with the data of the previous object(link) but adding the id as new property that the previous object did not have
      });
      //console.log(docs);
      setLinks(docs); //I add to the state links the value of all the links
    });
  };

  //We useEffect so as soon as the component renders(as soon as we reload the page, because the component Link is my main component that i have on App.js) it executes the function that is inside useEffect
  useEffect(() => {
    getLinks();
  }, []);

  return (
    <div>
      <div className="col-md-4 p-2">
        <LinkForm {...{ addOrEditLink, currentId, links }} />
      </div>
      <div className="col-md-8 p-2">
        {links.map((link) => (
          <div className="card mb-1" key={link.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4>{link.name}</h4>
                <div>
                  <i
                    className="material-icons text-danger"
                    onClick={() => onDeleteLink(link.id)}
                  >
                    close
                  </i>
                  <i
                    className="material-icons"
                    onClick={() => setCurrentId(link.id)}
                  >
                    create
                  </i>
                </div>
              </div>
              <p>{link.description}</p>
              <a href={link.url} target="_blank" rel="noreferrer">
                Go to Website
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Links;
