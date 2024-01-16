-- LAW_CLASS

INSERT INTO `law_class` (`id`, `color`, `name`)
VALUES (1, '#70a4ff', 'Rechtsbetrekking'),
       (2, '#c2e7ff', 'Rechtssubject'),
       (3, '#91E8D3', 'Voorwaarde'),
       (13, '#98BEF1', 'Rechtsobject'),
       (14, '#97D6FE', 'Rechtsfeit'),
       (15, '#FF7A7A', 'Afleidingsregel'),
       (16, '#FFD95D', 'Variabele'),
       (17, '#FFF380', 'Variabelewaarde'),
       (18, '#FFB4B4', 'Parameter'),
       (19, '#FFD8EF', 'Parameterwaarde'),
       (20, '#C1EBE1', 'Operator'),
       (21, '#D8B0F9', 'Tijdsaanduiding'),
       (22, '#EFCAF6', 'Plaatsaanduiding'),
       (23, '#CECECE', 'Delegatiebevoegdheid'),
       (24, '#E2E2E2', 'Delegatie-invulling'),
       (25, '#F6F6F6', 'Brondefinitie') ON DUPLICATE KEY
UPDATE id=id;

-- RELATION

INSERT INTO `relation` (`id`, `main_law_class_id`, `sub_law_class_id`, `description`, `cardinality`)
VALUES (1, 1, 2, 'Wie heeft het recht', 'V_1'),
       (2, 1, 2, 'Wie heeft de plicht', 'V_1'),
       (3, 1, 13, 'Heeft als voorwerp', 'V_1'),
       (4, 1, 14, 'Wordt gecreërd door', 'NV_0_1_N'),
       (5, 1, 14, 'Wordt gewijzigd door', 'NV_0_1_N'),
       (6, 1, 14, 'Wordt beëindigd door', 'NV_0_1_N'),
       (7, 1, 3, 'Is geldig indien voldaan aan', 'NV_0_1_N'),
       (8, 14, 2, 'Wordt uitgevoerd door', 'NV_0_1'),
       (9, 14, 13, 'Heeft als voorwerp', 'V_1'),
       (10, 14, 1, 'Heeft als rechtsgevolg een nieuwe, gewijzigde en/of beëindigde', 'V_1_N'),
       (11, 14, 3, 'Is geldig indien voldaan aan', 'NV_0_1_N'),
       (12, 14, 22, 'Vindt plaats in', 'NV_0_1_N'),
       (13, 14, 21, 'Vindt plaats op', 'V_1'),
       (14, 2, 2, 'Is specialisatie van', 'NV_0_1'),
       (15, 2, 3, 'Is geldig indien voldaan aan', 'NV_0_1_N'),
       (16, 13, 13, 'Is specialisatie van', 'NV_0_1'),
       (17, 13, 3, 'Is geldig indien voldaan aan', 'NV_0_1_N'),
       (18, 15, 16, 'Heeft als invoer', 'NV_0_1_N'),
       (19, 15, 16, 'Heeft als uitvoer', 'V_1'),
       (20, 15, 20, 'Gebruikt', 'V_1_N'),
       (21, 15, 3, 'Is geldig indien voldaan aan', 'NV_0_1_N'),
       (22, 15, 19, 'Heeft als invoer', 'NV_0_1_N'),
       (23, 15, 18, 'Heeft als invoer', 'NV_0_1_N') ON DUPLICATE KEY
UPDATE id=id;

-- APPLICATION_PROPERTY

INSERT INTO `application_property` (`id`, `property_value`, `property_name`)
VALUES (1, 40, 'max_xml_files') ON DUPLICATE KEY
UPDATE id=id;