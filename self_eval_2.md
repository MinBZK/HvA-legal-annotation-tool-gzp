### Group Backlog progress

|Name          | Sprint #  |User stories worked on  |
|--------------|-----------|------------------------|
| Dennis van Schie   | **3 & 4** | [Removing annotation tags from the XML](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/76) - [Export annotated XML](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/15) - [Import annotated XML](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/84) - [Fix bug where annotations with a label that spans over multiple XML tags are not properly placed](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/81) - [Change highlighted color after changing the lawclass of an existing annotation](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/114) |
| Kevin van Hout     | **3 & 4** | [Vullen van de law class tabel in de database](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/18) - [Selecteren van artikelen bij importeren wet](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/54) - [Relaties in het datamodel van het juridisch analyseschema](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/59) - [[Nice to have] Dockerize your application](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/64) - [IssueProject titel weergeven](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/72), [Architectuur cleanup en efficienty](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/74) - [Alleen admins mogen project verwijderen](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/83) - [Mock user en rollen systeem](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/87) [Documentatie developer](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/90) - [Artikel selectie aanpassen](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/97) - [Documentatie user](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/98) - [Samenvoegen van annotaties met de zelfde lawclass in overzicht](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/111) - [Nieuwe manier van annoteren implementeren](https://gitlab.fdmci.hva.nl/se-specialization-2023-1/projects-ik/galactische-zakenpartners/legal-annotation-tool/-/issues/115) |
| Delbert Densu      | **2** | |
| Hanna Toenbreker   | **2** | |
| Taner Özgüner      | **2** | |
| Chi Yu Yeung       | **2** | |


### Individual Evaluation Feedback

|  Name       | Focus 1     | Focus 2  | Focus 3 | Focus 4 |
|---------|-------------|----------|---------|---------|
| Kevin van Hout | Mock user system  | Re-write of annotating | Testing mock user system (front- and back-end)  | N/A      |      

#### Tops:
 - The application contains a mock user and role system.
 - A large annotation bug has been fixed.

#### Tips:

 - The annotation bug fix did not fix all of the annotation issues.

|  Name       | Focus 1     | Focus 2  | Focus 3 | Focus 4 |
|---------|-------------|----------|---------|---------|
| Dennis van Schie | Export and import XML with annotations | Decoupled annotations from projects | Testing export/import of XML | Removing annotations from the XML after deleting them |      

#### Tops:
- The full export and import functionality, that had a high priority from Steven, has been fully implemented.
- The application now has a decoupled annotation system, which means that annotations are no longer tied to a project and are properly displayed when an XML with existing annotations is imported.

#### Tips:
- I tried to fix the bug that caused annotations that spanned multiple XML tags to not be properly placed. While this took a lot of time, the new approach did not succeed. However, the developer documentation for the application has been updated with a description of another approach that will fix the problem. Steven is aware of this and said that this was fine.
