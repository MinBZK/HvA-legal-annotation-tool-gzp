"use client";
import React, { FC, useEffect, useState } from 'react';
import { Project } from "../../models/project";
import '../../static/annotations.css'
import './xml.css'
import ExportXMLButton from "@/app/components/export-xml-button/export-xml-button";
import { BsArrowLeft } from 'react-icons/bs';
import { useRouter } from "next/navigation";
import { PiListChecksLight } from "react-icons/pi";
import ArticleSelectionModal from '@/app/components/article-selection-modal/article-selection-modal';
import { uploadXML } from '@/app/services/project';

interface XMLProps {
  project: Project;
  onTextSelection: (text: string, offset: number) => void;
  allowSelect: boolean;
}

const LoadXML: FC<XMLProps> = ({ project, onTextSelection, allowSelect }) => {
  const router = useRouter();
  const [renderXML, setRenderXML] = useState(false);
  const [annotationStyles, setAnnotationStyles] = useState({});
  const [articles, setArticles] = useState<HTMLElement[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<boolean[]>([]);
  const [showSelectArticlesModal, setShowSelectArticlesModal] = useState<boolean>(false);

  useEffect(() => {
    // Convert the XML string to a readable DOM object
    let parser = new DOMParser();
    let xml = parser.parseFromString(project.xml_content, "application/xml");
    setRenderXML(true);
    fetchAnnotationsAndStyles(xml);

  }, [project.xml_content]);

  /**
   * Fetches annotation data for each annotation tag in the given XML document.
   * For each annotation, it retrieves the color associated with its law class and adds it as a CSS rule, which is later
   * applied to the page.
   *
   * @param {Document} xmlDoc - The XML document containing annotation tags.
   */
  const fetchAnnotationsAndStyles = async (xmlDoc: Document) => {
    const annotations = xmlDoc.getElementsByTagName('annotation');
    let newAnnotationStyles: any = {};
    // Loop through all annotations and fetch the annotation data
    // @ts-ignore
    for (let annotation of annotations) {
      const id = annotation.getAttribute('id');
      if (id) {
        const response = await fetch(`${process.env.API_URL}/annotations/${id}`);
        if (response.ok) {
          const annotationData = await response.json();

          newAnnotationStyles[`${id}`] = annotationData?.lawClass?.color;
        } else {
          console.error('Failed to fetch annotation data');
        }
      }
    }

    setAnnotationStyles(newAnnotationStyles);
  };


  /**
   * Generates CSS styles for annotations based on their id and the associated color.
   * It creates a string of CSS rules that is later added to the HTML.
   *
   * @returns {string} A string of CSS rules for styling annotations.
   */
  const renderStyles = () => {
    let styleString = "";
    for (const [selector, color] of Object.entries(annotationStyles)) {
      styleString += `annotation[id="${selector}"] { background-color: ${color}; border-radius: 4px; outline: ${color} solid 1px }\n`;
    }
    return styleString;
  };

  const handleShow = () => {
    // Check if text selection is allowed
    if (allowSelect) {
      const selection = window.getSelection();

      // Check if there is a non-collapsed selection
      if (selection && !selection.isCollapsed) {
        // Get the range of the selection
        const range = selection.getRangeAt(0);

        // Check if the selection spans multiple elements
        const commonAncestor = range.commonAncestorContainer;
        if (commonAncestor.nodeType !== Node.TEXT_NODE) {
          // If the selection spans multiple elements, do nothing and return
          return;
        }

        // Create a new span element for the annotation with a random id
        const spanElement = document.createElement('temp-annotation');
        const randId = Math.floor(Math.random() * 100);
        spanElement.setAttribute('id', `${randId}`);

        // Surround the selected text with the span element
        range.surroundContents(spanElement);
        const text = range.toString();

        // Serialize the XML content after the annotation
        project.xml_content = new XMLSerializer().serializeToString(document.getElementsByClassName('xml-content')[0]);

        // If there is selected text, call the onTextSelection function
        if (text) {
          onTextSelection(text, randId);
        }

        // Clear the selection
        selection.removeAllRanges();
      }
    }
  };

  const renderXMLContent = () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(project.xml_content, "application/xml");

    if (project.selectedArticles != "" && project.selectedArticles != null) {
      const articles = project.selectedArticles.split(',');
      // Loop through all the selected articles and show them on the page
      for (let i = 0; i < articles.length; i++) {
        const element = xml.getElementById(articles[i].trim());

        if (element !== null && element !== undefined) {
          if (element.classList) {
            // Add the class show to the article
            element.classList.add('show');
          }
        }
      }
    } else {
      xml.getElementsByTagName('bwb-wijzigingen')[0].classList.add('show-all')
    }

    return xml.documentElement.innerHTML;
  }
  const handleGoBack = () => {
    router.push('/');
  };

  const handleSelection = () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(project.xml_content, "application/xml");
    if (xml != null) {
      const listArticles = xml.querySelectorAll("artikel")

      // check if children exist
      if (listArticles == null || listArticles.length == 0) {
        alert("no articles in xml")
      }

      const arrArticle: any[] = []
      const arrArticleBools: boolean[] = []
      for (let i = 0; i < listArticles.length; i++) {
        arrArticle.push(listArticles.item(i));

        if (project.selectedArticles != "" && project.selectedArticles != null && project.selectedArticles.split(", ").includes(listArticles.item(i).id)) {
          arrArticleBools.push(true);
        } else {
          arrArticleBools.push(false);
        }
      }
      setArticles(arrArticle);
      setSelectedArticles(arrArticleBools);
      setShowSelectArticlesModal(true);
    }
  }

  const handleArticleSelect = async (value: string[]) => {
    let selectedArticles = "";
    if (value.length > 0) {
      selectedArticles = value.join(", ");
    }
    project.selectedArticles = selectedArticles;
    await uploadXML(project.xml_content, project.title, selectedArticles, project.id);
    setShowSelectArticlesModal(false);
  };

  const cancelArticleSelect = (value: Boolean) => {
    setShowSelectArticlesModal(false);
  }

  return (
    <>
      <style>
        {renderStyles()}
      </style>
      <>
        {
          showSelectArticlesModal ?
            <ArticleSelectionModal xmlArticles={articles} handleArticleSelect={handleArticleSelect} cancelArticleSelect={cancelArticleSelect} prevSelectedArticles={selectedArticles} ></ArticleSelectionModal>
            : ""
        }

        <div className='action-buttons'>
          <button className="back-button"
            onClick={handleGoBack}>
            <BsArrowLeft className="icon" /> Terug
          </button>
          <div>
            <button className="change-selection"
              onClick={handleSelection}>
              <PiListChecksLight className="icon" /> Wijzig selectie
            </button>
            <ExportXMLButton xmlData={project.xml_content} projectTitle={project.title} />
          </div>
        </div>

        <p className="xml-content" onMouseUp={handleShow} dangerouslySetInnerHTML={{ __html: renderXML && renderXMLContent() }} />
      </>
    </>
  );
}

export default LoadXML;
