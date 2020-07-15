import { makeExecutableSchema, addMockFunctionsToSchema, MockList } from 'graphql-tools';
import { graphql, GraphQLScalarType, Kind } from 'graphql';
import Mock from 'mockjs';

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
    field: String
    value: SORTVALUE
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
  }
  type LinkTaskList {
    list: [LinkTask]
    count: Int
    one(id:ID): LinkTask
    head: LinkTask
  }
  type LinkTask {
    id: ID
    rboSetInfoName: String,
    appName: String,
    own: Boolean
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
    name: String
    email: String
    avatar: String
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
    childrenLoc(pagination:Pagination, where:String, sorter: [SortItem]): LocationList
  }
  type DocLinks {
    id: ID
    name: String
    filename: String
    url: String
    created_by: PersonList
    created_time: String
  }
  type DocLinksList {
    list: [DocLinks]
    count: Int
    one(id:ID): DocLinks
    head: DocLinks
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
    created_by: PersonList
    created_time: String
    status: Int
    owner: PersonList
    ownerSelect: PersonList
    eq: EquipmentList
    eqSelect(pagination:Pagination, where:String, sorter: [SortItem]): EquipmentList
    docLinks(pagination:Pagination, where:String, sorter: [SortItem]): DocLinksList
    locationSelect: LocationList
    assocEQ(pagination:Pagination, where:String, sorter: [SortItem]): EquipmentList
    assocItem(pagination:Pagination, where:String, sorter: [SortItem]): ItemList
    assocPerson(pagination:Pagination, where:String, sorter: [SortItem]): PersonList
    linkTask(pagination:Pagination, where:String, sorter: [SortItem]): LinkTaskList
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
    appName:String
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
      })),
      count: () => 100,
      one: (id) => ({
        woNum: () => 'WO' + Random.integer(100, 999),
        woNumSelect: () => ({
          list: () => new MockList(5,()=>({
            woNum: () => 'WO' + Random.integer(100, 999),
            status: ()=> Random.integer(0, 1),
            created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
          })),
          count: () => 20,
        }),
        eq: () => ({
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
          }),
          descSelect: () => ({
            list: () => new MockList(5,() => ({
              eqNum: () => 'EQ' + Random.integer(100, 999),
              desc: () => Random.cword(10),
            })),
            count: () => 20,
          }),
        }),
        eqSelect: () => ({
          list: () => new MockList(5,()=>({
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
          count: () => 20,
        }),
        status: () => Random.natural(0, 1),
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
          })),
          count: () => 10,
        }),
        assocEQ: () => ({
          list: () => new MockList(5,()=>({
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
          one:() => ({
            eqNum: () => 'EQ' + Random.integer(100, 999),
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
        linkTask: () => ({
          list: () => new MockList(10, () => ({
            rboSetInfoName: () => 'ITEM' + Random.natural(100, 999),
            appName: () => Random.cword(10),
            own:()=> true,
          })),
          count: () => 100,
          head: ()=> ({
            rboSetInfoName: () => 'ITEM' + Random.natural(100, 999),
            appName: () => Random.cword(10),
            own:()=> false,
          }),
          one: (id)=>({
            rboSetInfoName: () => 'ITEM' + Random.natural(100, 999),
            appName: () => Random.cword(10),
            own:()=> true,
          }),
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
        name: () => 'wrokflow' + Random.natural(100, 999),
        appName: () => Random.cword(10)
      })),
      count: () => 100,
    }),
  }),
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers:typeResolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

const extend = (_option) => {
  return (url,{data,method}):any => {
    if(url === '/api/graphql'){
      const { query, variables } = data;
      return graphql(schema, query, null, null, variables);
    }else if(url === '/api/validate'){
      const { variables } = data;
      const woNum = variables['woNum'];
      if(woNum && woNum.indexOf('WO') !== 0){
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({status:2,field:'woNum',message:'工单编号必须以WO开头'});
          }, 300);
        });
      }
      return new Promise((resolve, reject) => {
        resolve({status:1});
      });
    }else if(url === '/api/getAppJSON'){
      const { app } = data;
      if(app === 'equipment')
        return new Promise((resolve, reject) => {
          resolve();
        });
      else if(app === 'workorder')
        return new Promise((resolve, reject) => {
          resolve();
        });
    }else if(url === '/api/uploadFiles'){
      return new Promise((resolve, reject) => {
        resolve({md5:'1234567890abcd',url:'http://xxxxx.com'});
      });
    }else {
      return Promise.resolve();
    }
  }
};

export {
  extend,
};
