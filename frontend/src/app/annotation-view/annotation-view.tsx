'use client'; // This is a client component 👈🏽

import React, { FC, useEffect, useState } from 'react';
import AnnotatedRow from '@/app/annotation-view/annotated-row/annotated-row';
import { Annotation } from '@/app/models/annotation';
import css from './annotation-view.module.css';
import { LawClass } from '../models/lawclass';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface AnnotationViewProps {
  onAnnotationDelete: (annotationId: number) => void;
  retrieveAnnotations: () => Promise<Annotation[]>;
  isLoading: boolean;
  handleAnnotationSaved: () => void;
}

type GroupedAnnotations = { lawClass: LawClass; annotations: Annotation[]; open: boolean }[];

const AnnotationView: FC<AnnotationViewProps> = ({ onAnnotationDelete, retrieveAnnotations, isLoading, handleAnnotationSaved }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [groupedAnnotations, setGroupedAnnotations] = useState<GroupedAnnotations>([]);

  /**
   * Calls the retrieveAnnotations function to fetch the annotations from the database and sets the annotations state
   */
  const fetchAnnotations = async () => {
    let annotations = await retrieveAnnotations();

    if (annotations) {
      // Filter out null annotations
      annotations = annotations.filter((annotation) => annotation != null);

      setAnnotations(annotations);
      setGroupedAnnotations(groupAnnotationsByLawClass(annotations));
      let styleString = '';

      for (let annotation of annotations) {
        let color = annotation.lawClass?.color;
        if (color) {
          styleString += `annotation[id="${annotation.id}"] { background-color: ${color} !important; border-radius: 4px; outline: ${color} solid 1px }\n`;
        }
      }
      updateStyles(styleString);
    } else {
      console.error('Geen annotaties opgehaald');
    }
  };

  function updateStyles(newStyles: string) {
    // Select the div with the class 'left-column'
    const leftColumnDiv = document.querySelector('.left-column');

    // Find the <style> tag within this div
    const styleTag = leftColumnDiv?.querySelector('style');

    // Replace the content of the <style> tag with new styles
    if (styleTag) {
      styleTag.innerHTML = newStyles;
    } else {
      console.error('Style tag not found');
    }
  }

  const groupAnnotationsByLawClass = (annotations: Annotation[]): GroupedAnnotations => {
    const groupedAnnotations: GroupedAnnotations = [];

    annotations.forEach((annotation) => {
      if (annotation.lawClass) {
        const lawClassName = annotation.lawClass.name;

        const existingGroup = groupedAnnotations.find((group) => group.lawClass.name === lawClassName);

        if (existingGroup) {
          existingGroup.annotations.push(annotation);
        } else {
          groupedAnnotations.push({
            lawClass: annotation.lawClass,
            annotations: [annotation],
            open: false,
          });
        }
      }
    });
    return groupedAnnotations;
  };

  useEffect(() => {
    (async () => {
      if (!isLoading) {
        await fetchAnnotations();
      }
    })();
    // The isLoading dependency is used to make sure the annotations are only fetched once the project data is loaded
  }, [isLoading]);

  // Update the handleEdit function to include a term parameter
  const handleEdit = async (annotationDetails: Annotation, id: number) => {
    try {
      const response = await fetch(`${process.env.API_URL}/annotations/updateannotation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(annotationDetails),
      });

      if (response.ok) {
        alert('Annotatie succesvol bijgewerkt');
        fetchAnnotations(); // Refetch annotations
        handleAnnotationSaved();
      } else {
        alert('Fout annotatie bijwerken');
      }
    } catch (error) {
      console.error('Fout annotatie bijwerken:', error);
      alert('Fout annotatie verwijderen');
    }
  };

  /**
   * Delete an annotation
   * This is done by sending a DELETE request to the API, removing the <annotation> tags from the xml and saving the
   * updated XML without the tags.
   *
   * @param id database id of the annotation
   */
  const handleDelete = async (id: number) => {
    try {
      // Remove the annotation from the database
      const response = await fetch(`${process.env.API_URL}/annotations/deleteannotation/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // If everything went well, remove the annotation tags from the XML
        await onAnnotationDelete(id);
        await fetchAnnotations(); // Refetch annotations to update the list
      } else {
        alert('Fout annotatie verwijderen');
      }
    } catch (error) {
      console.error('Fout annotatie verwijderen:', error);
      alert('Fout annotatie verwijderen');
    }
  };

  return (
    <div>
      <div className={css.topBar}>
        <h2 className={css.title}>Annotaties</h2>
      </div>

      <div className={'annolist p-3 mb-5 bg-white'}>
        {annotations &&
          groupedAnnotations.map((value, index) => (
            <div className={css.annotatedRow} key={index}>
              <div
                className={css.annotationTitle}
                style={{ background: value.lawClass?.color }}
                onClick={() => {
                  const updatedGroupedAnnotations = [...groupedAnnotations];
                  updatedGroupedAnnotations[index].open = !updatedGroupedAnnotations[index].open;
                  setGroupedAnnotations(updatedGroupedAnnotations);
                }}
              >
                <h5 className={css.annotationName}>{value.lawClass?.name}</h5>
                {value.open ? <FaChevronDown className={css.align} /> : <FaChevronUp />}
              </div>
              {value.annotations.map((annotation, subIndex) => (
                <AnnotatedRow key={subIndex} annotation={annotation} handleEdit={handleEdit} handleDelete={handleDelete} open={value.open} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AnnotationView;
