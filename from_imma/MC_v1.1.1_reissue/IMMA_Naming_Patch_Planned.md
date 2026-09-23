# Foundation Naming Patch — planned

При следующем versioned обновлении Foundation роль должна называться:

**IMMA — Investment Modeling & Methodology Agent**

`IMA` сохраняется только как deprecated alias для ссылочной совместимости старых документов/skill IDs,
если переименование ID создаёт лишнюю миграцию.

Рекомендуемый подход:
- role_display_name: Investment Modeling & Methodology Agent
- role_acronym: IMMA
- legacy_aliases: [IMA]
- существующие skill IDs IMA-01…IMA-11 пока не переименовывать без отдельной миграции ссылок.
