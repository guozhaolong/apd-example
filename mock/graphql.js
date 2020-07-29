import { makeExecutableSchema, addMockFunctionsToSchema, MockList } from 'graphql-tools';
import { graphql, GraphQLScalarType, Kind } from 'graphql';
import Mock from 'mockjs';
import demoEQ from '../src/pages/demoEQ';
import demoWO from '../src/pages/demoWO';

const { Random } = Mock;

const typeDefs = `
  enum DATASTATE {
    NEW
    DELETE
    UPDATE
    NONE
  }
  enum SORTVALUE {
    ASC
    DESC
  }
  scalar Date
  input Pagination{
    currentPage: Int
    pageSize: Int
  }
  input SortItem{
    key: String!
    value: SORTVALUE!
  }
  type BookmarkList {
    list: [Bookmark]
    count: Int
    one(id:ID): Bookmark
    head: Bookmark
  }
  type Bookmark {
    id: ID
    app: String
    keyValue: String
    desc: String
    userID: ID
    created_time: String
  }
  type FilterList {
    list: [Filter]
    count: Int
    one(id:ID): Filter
    head: Filter
  }
  type Filter {
    id: ID
    clauseName: String
    desc: String
    isPublic: Boolean
    isDefault: Boolean
    clause: String
  }
  type ItemList {
    list: [Item]
    count: Int
    one(id:ID): Item
    head: Item
  }
  type Item {
    id: ID
    itemNum: String
    desc: String
    amount: Int
    cost: Int
    fieldFlags:[FieldFlags]
  }
  type WorkflowCandidatePersonList {
    list: [WorkflowCandidatePerson]
    count: Int
    one(id:ID): WorkflowCandidatePerson
    head: WorkflowCandidatePerson
  }
  type WorkflowCandidatePerson {
    id: ID
    personId: String
    personObj: PersonList
    processDefKey: String
    description: String
    fieldFlags:[FieldFlags]
  }
  type LinkTaskList {
    list: [LinkTask]
    count: Int
    one(id:ID): LinkTask
    head: LinkTask
  }
  type LinkTask {
    id: ID
    rboSetInfoName: String
    appName: String
    name: String
    comment: String
    selectAction: String
    own: Boolean
    description: String
    actionList: ActionList
    taskDefinitionKey: String
    fieldFlags:[FieldFlags]
    candidatePersonList(pagination:Pagination, where:String, sorter: [SortItem]): WorkflowCandidatePersonList
  }
  type HistoryTaskList {
    list: [HistoryTask]
    count: Int
    one(id:ID): HistoryTask
    head: HistoryTask
  }
  type HistoryTask {
    id: ID
    appName: String
    description: String
    comment: String
    createTime: String
    fieldFlags:[FieldFlags]
    approvePersonObj(pagination:Pagination, where:String, sorter: [SortItem]): PersonList
  }
  type ActionList {
    list: [Action]
    count: Int
    one(id:ID): Action
    head: Action
  }
  type Action {
    id: ID
    name: String
  }
  type DescList {
    list: [Desc]
    count: Int
    one(id:ID): Desc
    head: Desc
  }
  type Desc {
    id: ID
    eqNum: String
    desc: String
  }
  type PersonList {
    list: [Person]
    count: Int
    one(id:ID): Person
    head: Person
  }
  type Person {
    id: ID
    personID: String
    displayName: String
    name: String
    email: String
    avatar: String
    fieldFlags:[FieldFlags]
    assocWO(pagination:Pagination, where:String, sorter: [SortItem]): WorkorderList
  }
  type LocationList {
    list: [Location]
    count: Int
    one(id:ID): Location
    head: Location
  }
  type Location {
    id: ID
    location: String
    name: String
    parent: String
    fieldFlags:[FieldFlags]
    childrenLoc(pagination:Pagination, where:String, sorter: [SortItem]): LocationList
  }
  type DocLinks {
    id: ID
    name: String
    filename: String
    url: String
    created_by: PersonList
    created_time: String
    fieldFlags:[FieldFlags]
  }
  type DocLinksList {
    list: [DocLinks]
    count: Int
    one(id:ID): DocLinks
    head: DocLinks
  }
  type Status {
    id: ID
    value: String
    description: String
  }
  type StatusList {
    list: [Status]
    count: Int
    one(id:ID): Status
    head: Status
  }
  type EquipmentList {
    list: [Equipment]
    one(id:ID): Equipment
    count: Int
    head: Equipment
  }
  type Equipment {
    id: ID
    eqNum: String
    eqNumSelect(pagination:Pagination, where:String, sorter: [SortItem]): EquipmentList
    desc: String
    created_by: PersonList
    created_time: String
    type: String
    owner: PersonList
    status: Int
    item: ItemList
    isMain: Boolean
    fieldFlags:[FieldFlags]
    itemSelect(pagination:Pagination, where:String, sorter: [SortItem]): ItemList
    descSelect(pagination:Pagination, where:String, sorter: [SortItem]): DescList
    assocPerson(pagination:Pagination, where:String, sorter: [SortItem]): PersonList
    assocLocation(pagination:Pagination, where:String, sorter: [SortItem]): LocationList
  }
  type WorkorderList {
    list: [Workorder]
    count: Int
    one(id:ID): Workorder
    head: Workorder
  }
  type Workorder {
    id: ID
    woNum: String
    woNumSelect(pagination:Pagination, where:String, sorter: [SortItem]): WorkorderList
    desc: String
    fieldFlags:[FieldFlags]
    created_by: PersonList
    created_time: String
    status: Int
    statusSelect(pagination:Pagination, where:String, sorter: [SortItem]): StatusList
    owner: PersonList
    ownerSelect: PersonList
    eq: EquipmentList
    docLinks(pagination:Pagination, where:String, sorter: [SortItem]): DocLinksList
    locationSelect: LocationList
    assocEQ(pagination:Pagination, where:String, sorter: [SortItem]): EquipmentList
    assocItem(pagination:Pagination, where:String, sorter: [SortItem]): ItemList
    assocPerson(pagination:Pagination, where:String, sorter: [SortItem]): PersonList
    linkTaskList(pagination:Pagination, where:String, sorter: [SortItem]): LinkTaskList
    historyTaskList(pagination:Pagination, where:String, sorter: [SortItem]): HistoryTaskList
  }
  type FieldFlags {
    flag:Int
    field:String
  }
  type WorkflowProcessList {
    list: [WorkflowProcess]
    count: Int
    one(id:ID): WorkflowProcess
    head: WorkflowProcess
  }
  type WorkflowProcess {
    id: ID
    name: String
    appName: String
    description: String
    json: String
  }
  type Query {
    workorderFind(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : WorkorderList
    equipmentFind(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : EquipmentList
    itemFind(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : ItemList
    personFind(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : PersonList
    filterFind(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : FilterList
    bookmarkFind(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : BookmarkList
    linkTaskFind(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : LinkTaskList
    workflowProcessFind(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : WorkflowProcessList
  }
  input workorderInput {
    id: ID
    woNum: String
    created_time: String
    status: Int
    dataState: DATASTATE
  }
  input workflowTaskInput {
    id: ID
    rboId: String
    selectAction: String
    comment: String
    workflowProcessId: String
    dataState: DATASTATE
  }
  type Mutation {
    workorderSave(app:String!, workorder:[workorderInput!]!, pagination:Pagination, where:String, sorter: [SortItem]): WorkorderList
    workorderChangeStatus(app:String!, id: ID!, status: String!): Workorder
    workorderWF(app: String!, workflowTask: [workflowTaskInput!]!): [Workorder!]!
  }
`;

const typeResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return new Date(value); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

const min = 100;
const max = 9999;

const mocks = {
  ID: () => Random.guid(),
  Int: () => Random.natural(min, max),
  Float: () => Random.float(min, max),
  String: () => Random.ctitle(10, 5),
  Date: () => Random.date(),
  Boolean: () => Random.natural(0, 1),
  Pagination: () => ({
    currentPage: 1,
    pageSize: 10,
  }),
  Query: () => ({
    workorderFind: (self,{app,pagination}) => ({
      list: () => new MockList(10, () => ({
        woNum: () => 'WO' + Random.integer(100, 999),
        status: ()=> Random.integer(0, 1),
        created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
        fieldFlags: () => ([{
          field: () => 'woNum',
          flag: () => 128
        }])
      })),
      count: () => 100,
      one: (id) => ({
        woNum: () => 'WO' + Random.integer(100, 999),
        fieldFlags: () => ([{
          field: () => 'desc',
          flag: () => 135
        }]),
        woNumSelect: () => ({
          list: () => new MockList(5,()=>({
            woNum: () => 'WO' + Random.integer(100, 999),
            status: ()=> Random.integer(0, 1),
            created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
          })),
          count: () => 20,
        }),
        eq: () => ({
          list: () => new MockList(5,() => ({
            eqNum: () => 'EQ' + Random.integer(100, 999),
            status: ()=> Random.integer(0, 1),
          })),
          count: () => 10,
          head: () => ({
            eqNum: () => 'EQ' + Random.integer(100, 999),
            status: ()=> Random.integer(0, 1),
            assocPerson: () => ({
              list: () => new MockList(5,() => ({
                personID: () => Random.first(),
                name: ()=> Random.cname(),
                email: ()=> Random.email(),
                avatar: ()=> Random.image(),
              })),
              count: () => 20,
            }),
            eqNumSelect: () => ({
              list: () => new MockList(5,() => ({
                eqNum: () => 'EQ' + Random.integer(100, 999),
                desc: () => Random.cword(10),
              })),
              count: () => 20,
            }),
          })
        }),
        status: () => Random.natural(0, 1),
        statusSelect: () => ({
          list: () => new MockList(5),
          count: 5,
        }),
        created_by: () => ({
          personID: () => Random.first(),
          name: ()=> Random.cname(),
          email: ()=> Random.email(),
          avatar: ()=> Random.image()
        }),
        owner: () => ({
          personID: () => Random.first(),
          name: ()=> Random.cname(),
          email: ()=> Random.email(),
          avatar: ()=> Random.image()
        }),
        ownerSelect: () => ({
          list: () => new MockList(5,() => ({
            personID: () => Random.first(),
            name: ()=> Random.cname(),
            email: ()=> Random.email(),
            avatar: ()=> Random.image()
          })),
          count: () => 20,
        }),
        created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
        locationSelect: () => ({
          list: () => [
            { id: 'loc1', location: 'loc1', name: '总部', parent: '' },
            { id: 'loc11', location: 'loc11', name: '北京总部', parent: 'loc1' },
            { id: 'loc12', location: 'loc12', name: '天津总部', parent: 'loc1' },
            { id: 'loc2', location: 'loc2', name: '分公司', parent: '' },
            { id: 'loc21', location: 'loc21', name: '上海分公司', parent: 'loc2' },
            { id: 'loc22', location: 'loc22', name: '深圳分公司', parent: 'loc2' },
          ],
          count: () => 6,
        }),
        docLinks: () => ({
          list: () => new MockList(5,() => ({
            filename: ()=> Random.word(6)+"."+Random.word(3),
            url: ()=> Random.url('http'),
            created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
            fieldFlags: () => ([{
              field: () => 'name',
              flag: () => 7
            }]),
          })),
          count: () => 10,
          one: () => ({
            fieldFlags: () => ([{
              field: () => 'name',
              flag: () => 7
            }]),
          })
        }),
        assocEQ: () => ({
          list: () => new MockList(5,()=>({
            eqNum: () => 'EQ' + Random.integer(100, 999),
            status: ()=> Random.integer(0, 1),
            fieldFlags: () => ([{
              field: () => 'eqNum',
              flag: () => 0
            }]),
            assocPerson: () => ({
              list: () => new MockList(5,() => ({
                personID: () => Random.first(),
                name: ()=> Random.cname(),
                email: ()=> Random.email(),
                avatar: ()=> Random.image(),
              })),
              count: () => 20,
            })
          })),
          one:() => ({
            eqNum: () => 'EQ' + Random.integer(100, 999),
            fieldFlags: () => ([{
              field: () => 'personID',
              flag: () => 135
            }]),
            eqNumSelect: () => ({
              list: () => new MockList(5,()=>({
                eqNum: () => 'EQ' + Random.integer(100, 999),
                status: ()=> Random.integer(0, 1),
              })),
              count: () => 20,
            }),
            status: ()=> Random.integer(0, 1)
          }),
          count: () => 20,
        }),
        assocItem: () => ({
          list: () => new MockList(5,() => ({
            itemNum: () => 'ITEM' + Random.integer(100, 999),
            desc: () => Random.cword(10),
            amount: () => Random.integer(10,20),
            cost: () => Random.integer(100,500),
          })),
          count: () => 20,
        }),
        assocPerson: () => ({
          list: () => new MockList(5,() => ({
            personID: () => Random.first(),
            name: ()=> Random.cname(),
            email: ()=> Random.email(),
            avatar: ()=> Random.image()
          })),
          count: () => 20,
        }),
        linkTaskList: () => ({
          list: () => new MockList(10, () => ({
            rboSetInfoName: () => 'ITEM' + Random.natural(100, 999),
            appName: () => Random.cword(10),
            own:()=> true,
          })),
          count: () => 100,
          head: ()=> ({
            rboSetInfoName: () => 'ITEM' + Random.natural(100, 999),
            appName: () => Random.cword(10),
            own:()=> true,
            taskDefinitionKey: () => Random.boolean() ? "taskNode1" : "taskNode4",
            candidatePersonList: {
              list: () => new MockList(3, () => ({
                personId: () => Random.name(),
                personObj: () => ({
                  head: ()=> ({
                    displayName: Random.cname()
                  })
                }),
                processDefKey: () => 'WOFlow',
              })),
              count: 3,
            },
          }),
          one: (id)=>({
            rboSetInfoName: () => 'ITEM' + Random.natural(100, 999),
            appName: () => Random.cword(10),
            own:()=> true,
          }),
        }),
        historyTaskList: () => ({
          list: () => new MockList(5, () => ({
            rboSetInfoName: () => 'ITEM' + Random.natural(100, 999),
            approvePersonObj: () => ({
              head: ()=> ({
                displayName: Random.cname()
              })
            }),
            createTime: () => Random.datetime("yyyy-MM-dd HH:mm:ss"),
          })),
          count: () => 100,
        })
      })
    }),
    equipmentFind: (self,{app,pagination}) => ({
      list: () => new MockList(10, () => ({
        eqNum: () => 'EQ' + Random.integer(100, 999),
        status: ()=> Random.integer(0, 1),
        assocPerson: () => ({
          list: () => new MockList(5,() => ({
            personID: () => Random.first(),
            name: ()=> Random.cname(),
            email: ()=> Random.email(),
            avatar: ()=> Random.image()
          })),
          count: () => 20,
        })
      })),
      count: () => 100,
      one: (id) => ({
        eqNum: () => 'EQ' + Random.integer(100, 999),
        eqNumSelect: () => ({
          list: () => new MockList(5,()=>({
            eqNum: () => 'EQ' + Random.integer(100, 999),
            status: ()=> Random.integer(0, 1),
            created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
          })),
          count: () => 20,
        }),
        status: ()=> Random.integer(0, 1),
        created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
        item: () => ({
          itemNum: () => 'ITEM' + Random.integer(100, 999),
          desc: () => Random.cword(10),
          amount: () => Random.integer(10,20),
          cost: () => Random.integer(100,500),
        }),
        itemSelect: () => ({
          list: () => new MockList(5,() => ({
            itemNum: () => 'ITEM' + Random.integer(100, 999),
            desc: () => Random.cword(10),
            amount: () => Random.integer(10,20),
            cost: () => Random.integer(100,500),
          })),
          count: () => 20,
        }),
        assocPerson: () => ({
          list: () => new MockList(5,() => ({
            personID: () => Random.first(),
            name: ()=> Random.cname(),
            email: ()=> Random.email(),
            avatar: ()=> Random.image()
          })),
          count: () => 20,
        })
      }),
    }),
    itemFind: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 10, () => ({
        itemNum: () => 'ITEM' + Random.natural(100, 999),
        desc: () => Random.cword(10)
      })),
      count: () => 100,
      head: ()=> ({
        itemNum: () => 'ITEM' + Random.natural(100, 999),
        desc: () => Random.cword(10)
      }),
      one: (id)=>({
        itemNum: () => 'ITEM' + Random.natural(100, 999),
        desc: () => Random.cword(10)
      }),
    }),
    personFind: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 10, () => ({
        personID: () => Random.name(),
        name: ()=> Random.cname(),
        email: ()=> Random.email(),
        avatar: ()=> Random.image()
      })),
      count: () => 100,
      head: ()=> ({
        personID: () => Random.name(),
        name: ()=> Random.cname(),
        email: ()=> Random.email(),
        avatar: ()=> Random.image()
      }),
    }),
    filterFind: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 5, () => ({
        clauseName: () => Random.word(10),
        desc: ()=> Random.cword(10),
        isPublic: ()=> false,
        isDefault: ()=> false,
        clause: ()=> Random.word(20),
      })),
      count: () => 10,
    }),
    bookmarkFind: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 5, () => ({
        app: () => app,
        keyValue: ()=> Random.word(6),
        desc: ()=> Random.cword(10),
        created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
      })),
      count: () => 10,
    }),
    workflowProcessFind: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 10, () => ({
        name: () => 'workflow' + Random.natural(100, 999),
        appName: () => Random.cword(10),
        json: () => `{
          "nodes": [
            { "id": "startNode1", "x": 50, "y": 220, "label": "开始", "type": "start-node" },
            { "id": "taskNode1", "x": 180, "y": 220, "label": "主管审批", "type": "task-node" },
            { "id": "gatewayNode1", "x": 320, "y": 220, "label": "紧急会议?", "type": "condition-node" },
            { "id": "taskNode4", "x": 320, "y": 100, "label": "专家决策", "type": "task-node" },
            { "id": "catchNode1", "x": 450, "y": 100, "label": "等待结束", "type": "wait-node" },
            { "id": "taskNode2", "x": 450, "y": 220, "label": "部门领导审批", "type": "task-node" },
            { "id": "gatewayNode2", "x": 600, "y": 220, "label": "深度>100m", "type": "condition-node" },
            { "id": "taskNode3", "x": 600, "y": 350, "label": "公司领导审批", "type": "task-node" },
            { "id": "endNode", "x": 720, "y": 220, "label": "结束", "type": "stop-node" }
          ],
          "edges": [
            { "source": "startNode1", "target": "taskNode1", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode1", "target": "gatewayNode1", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "gatewayNode1", "target": "taskNode2", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": false },
            { "source": "gatewayNode1", "target": "taskNode4", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode4", "target": "catchNode1", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode2", "target": "gatewayNode2", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode2", "target": "taskNode1", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": false },
            { "source": "gatewayNode2", "target": "endNode", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": false },
            { "source": "gatewayNode2", "target": "taskNode3", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode3", "target": "endNode", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode3", "target": "taskNode4", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": false },
            { "source": "catchNode1", "target": "taskNode2", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true }
          ]
        }`
      })),
      head: ()=> ({
        appName: () => 'workorder',
        json: () => `{
          "nodes": [
            { "id": "startNode1", "x": 50, "y": 220, "label": "开始", "type": "start-node" },
            { "id": "taskNode1", "x": 180, "y": 220, "label": "主管审批", "type": "task-node" },
            { "id": "gatewayNode1", "x": 320, "y": 220, "label": "紧急会议?", "type": "condition-node" },
            { "id": "taskNode4", "x": 320, "y": 100, "label": "专家决策", "type": "task-node" },
            { "id": "catchNode1", "x": 450, "y": 100, "label": "等待结束", "type": "wait-node" },
            { "id": "taskNode2", "x": 450, "y": 220, "label": "部门领导审批", "type": "task-node","active":true },
            { "id": "gatewayNode2", "x": 600, "y": 220, "label": "深度>100m", "type": "condition-node" },
            { "id": "taskNode3", "x": 600, "y": 350, "label": "公司领导审批", "type": "task-node" },
            { "id": "endNode", "x": 720, "y": 220, "label": "结束", "type": "stop-node" }
          ],
          "edges": [
            { "source": "startNode1", "target": "taskNode1", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode1", "target": "gatewayNode1", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "gatewayNode1", "target": "taskNode2", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": false },
            { "source": "gatewayNode1", "target": "taskNode4", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode4", "target": "catchNode1", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode2", "target": "gatewayNode2", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode2", "target": "taskNode1", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": false },
            { "source": "gatewayNode2", "target": "endNode", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": false },
            { "source": "gatewayNode2", "target": "taskNode3", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode3", "target": "endNode", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true },
            { "source": "taskNode3", "target": "taskNode4", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": false },
            { "source": "catchNode1", "target": "taskNode2", "sourceAnchor": 0, "targetAnchor": 1,"isPositive": true }
          ]
        }`
      }),
      count: () => 100,
    }),
  }),
};

const schema = makeExecutableSchema({
  typeDefs,
  typeResolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

function graphqlQuery(req, res) {
  const { query, variables } = req.body;
  const { app,where } = variables;
  if(app && app === 'App'){
    if(where.indexOf('equipment') > 0){
      return res.json({
        items: [{
          appNum: 'equipment',
          description: '装备管理',
          json: JSON.stringify(demoEQ.app),
        }]
      });
    }else if(where.indexOf('workorder') > 0){
      return res.json({
        items: [{
          appNum: 'workorder',
          description: '工单管理',
          json: JSON.stringify(demoWO.app),
        }]
      });
    }
  }else {
    graphql(schema, query, null, null, variables).then(result => {
      return res.json(result);
    });
  }
}

function validateFields(req, res){
  const { variables } = req.body;
  const woNum = variables['woNum'];
  if(woNum && woNum.indexOf('WO') !== 0){
    return res.json({status:2,field:'woNum',message:'工单编号必须以WO开头'});
  }
  return res.json({status:1});
}

function uploadFiles(req, res){
  const { fieldname, originalname, mimetype, buffer, size } = req.files;
  return res.json({md5:'1234567890abcd',url:'http://xxxxx.com'});
}

const proxy = {
  'POST /api/graphql': graphqlQuery,
  'POST /api/validate': validateFields,
  'POST /api/uploadFiles': uploadFiles,
};

export default proxy;
