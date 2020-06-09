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
    field: String
    value: SORTVALUE
  }
  type BookmarkList {
    list: [Bookmark]
    count: Int
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
  }
  type Item {
    id: ID
    itemNum: String
    desc: String
    amount: Int
    cost: Int
  }
  type PersonList {
    list: [Person]
    count: Int
  }
  type Person {
    id: ID
    personID: String
    name: String
    email: String
    avatar: String
  }
  type LocationList {
    list: [Location]
    one(id:ID): Location
    count: Int
  }
  type Location {
    id: ID
    location: String
    name: String
    parent: String
  }
  type DocLinks {
    id: ID
    name: String
    filename: String
    url: String
    created_by: Person
    created_time: String
  }
  type DocLinksList {
    list: [DocLinks]
    count: Int
  }
  type EquipmentList {
    list: [Equipment]
    one(id:ID): Equipment
    count: Int
  }
  type Equipment {
    id: ID
    eqNum: String
    eqNumSelect(pagination:Pagination, where:String, sorter: [SortItem]): EquipmentList
    desc: String
    created_by: Person
    created_time: String
    status: Int
    item: Item
    itemSelect(pagination:Pagination, where:String, sorter: [SortItem]): ItemList
    assocPerson(pagination:Pagination, where:String, sorter: [SortItem]): PersonList
  }
  type WorkorderList {
    list: [Workorder]
    one(id:ID): Workorder
    count: Int
  }
  type Workorder {
    id: ID
    woNum: String
    woNumSelect(pagination:Pagination, where:String, sorter: [SortItem]): WorkorderList
    desc: String
    created_by: Person
    created_time: String
    status: Int
    owner: Person
    ownerSelect: PersonList
    eq: Equipment
    eqSelect(pagination:Pagination, where:String, sorter: [SortItem]): EquipmentList
    docLinks(pagination:Pagination, where:String, sorter: [SortItem]): DocLinksList
    locationSelect: LocationList
    assocEQ(pagination:Pagination, where:String, sorter: [SortItem]): EquipmentList
    assocItem(pagination:Pagination, where:String, sorter: [SortItem]): ItemList
    assocPerson(pagination:Pagination, where:String, sorter: [SortItem]): PersonList
  }
  type Query {
    workorder_find(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : WorkorderList
    workorder_findOne(app:String!, id:ID!) : Workorder
    equipment_find(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : EquipmentList
    equipment_findOne(app:String!, id:ID!) : Equipment
    item_find(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : ItemList
    item_findOne(app:String!, id:ID!) : Item
    person_find(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : PersonList
    person_findOne(app:String!, id:ID!) : Person
    filter_find(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : FilterList
    bookmark_find(app:String!, pagination:Pagination, where:String, sorter: [SortItem]) : BookmarkList
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
    workorder_find: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 10, () => ({
        woNum: () => 'WO' + Random.integer(100, 999),
        status: ()=> Random.integer(0, 1),
        created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
      })),
      count: () => 100,
    }),
    workorder_findOne: (self,{app,id}) => ({
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
      })
    }),
    equipment_find: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 10, () => ({
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
    }),
    equipment_findOne: (self,{app,id}) => ({
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
    item_find: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 10, () => ({
        itemNum: () => 'ITEM' + Random.natural(100, 999),
        desc: () => Random.cword(10)
      })),
      count: () => 100,
    }),
    person_find: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 10, () => ({
        personID: () => Random.name(),
        name: ()=> Random.cname(),
        email: ()=> Random.email(),
        avatar: ()=> Random.image()
      })),
      count: () => 100,
    }),
    filter_find: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 5, () => ({
        clauseName: () => Random.word(10),
        desc: ()=> Random.cword(10),
        isPublic: ()=> false,
        isDefault: ()=> false,
        clause: ()=> Random.word(20),
      })),
      count: () => 10,
    }),
    bookmark_find: (self,{app,pagination:{ pageSize }}) => ({
      list: () => new MockList(pageSize || 5, () => ({
        app: () => app,
        keyValue: ()=> Random.word(6),
        desc: ()=> Random.cword(10),
        created_time: ()=> Random.datetime("yyyy-MM-dd HH:mm:ss"),
      })),
      count: () => 10,
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
  graphql(schema, query, null, null, variables).then(result => {
    return res.json(result);
  });
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
  return res.json(['1234567890abcd']);
}

function getAppJSON(req, res){
  const { app } = req.body;
  if(app === 'equipment')
    return res.json(demoEQ);
  else if(app === 'workorder')
    return res.json(demoWO);
}

const proxy = {
  'POST /api/graphql': graphqlQuery,
  'POST /api/validate': validateFields,
  'POST /api/uploadFiles': uploadFiles,
  'POST /api/getAppJSON': getAppJSON,
};

export default proxy;
