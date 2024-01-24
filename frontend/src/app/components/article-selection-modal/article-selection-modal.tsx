// src/app/components/export/ExportXMLButton.tsx

import React, { useState } from 'react';
import './article-selection-modal.css';
import { Button, Modal } from 'react-bootstrap';

type articleSelectionModalProps = {
    xmlArticles: HTMLElement[];
    handleArticleSelect: any;
    cancelArticleSelect: any;
    prevSelectedArticles: boolean[];
};

const ArticleSelectionModal: React.FC<articleSelectionModalProps> = ({ xmlArticles, handleArticleSelect, cancelArticleSelect, prevSelectedArticles = [] }) => {

    const [articleChecked, setArticleChecked] = useState<boolean[]>(prevSelectedArticles);

    const collectSelectedArticles = (isSelectedAll?: boolean) => {
        if (isSelectedAll) {
            handleArticleSelect("");
        } else {
            const list: string[] = [];

            for (let i = 0; i < xmlArticles.length; i++) {
                if (articleChecked[i]) {
                    list.push(xmlArticles[i].id)
                }
            }

            if (list.length > 0) {
                setTimeout(() => {
                    handleArticleSelect(list);
                }, 1000);
            }
        }

    }

    const checkHandler = (index: number) => {
        setArticleChecked(() => {
            const newList = [...articleChecked];
            newList[index] = !newList[index]
            return newList
        })
    }

    const disableCheck: () => boolean = () => {
        return articleChecked.includes(true);
    };

    return <>
        <Modal show={true} className='full-screen'>
            <Modal.Header>
                <Modal.Title>Selecteer artikelen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {xmlArticles && xmlArticles.map((value, index) => (
                    <div key={index} className={"m-1 articles"}>
                        <label className={"d-flex align-content-center"}>
                            <input type={"checkbox"} checked={articleChecked[index]}
                                onChange={() => checkHandler(index)}
                            />
                            <div className={"article-holder"}>
                                <div>{value.getAttribute('label')}</div>
                                <div>{value.getElementsByTagName("kop")[0]?.getElementsByTagName("titel")[0]?.textContent}</div>
                            </div>
                        </label>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button id={"confirmSelectionButton"} className='save float-end mt-3' disabled={!disableCheck()} onClick={() => {
                    collectSelectedArticles()
                }}>
                    Bevestig selectie
                </Button>

                <Button className='save float-end m-2 mt-3' onClick={() => {
                    collectSelectedArticles(true)
                }}>
                    Selecteer alles
                </Button>
                <Button className='cancel float-end m-2 mt-3' onClick={() => {
                    cancelArticleSelect(true);
                }}>
                    Annuleer
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
};

export default ArticleSelectionModal;
